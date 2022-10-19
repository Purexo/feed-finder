function cleanNode(node) {
	while (node.firstChild) {
		node.firstChild.remove();
	}
}

async function main() {
	const [currentTab] = await chrome.tabs.query({active: true, currentWindow: true});
	if (!currentTab) return;

	const port = chrome.runtime.connect({name: 'popup-page'});

	port.onMessage.addListener(message => {
		if (message.type !== 'POPUP_INIT_RESPONSE') return;

		const data = message.data;

		const $app = document.querySelector('#app');
		cleanNode($app);

		if (!data?.length) {
			/** @type {HTMLTemplateElement} */
			const $emptyTpl = document.querySelector('template#empty-state');
			const $node = $emptyTpl.content.cloneNode(true);

			return $app.appendChild($node);
		}

		/** @type {HTMLTemplateElement} */
		const $rowTemplate = document.querySelector('template#link-row');
		const $node = document.createElement('ul');

		$app.appendChild($node);

		for (const item of data) {
			const $li = $rowTemplate.content.cloneNode(true);

			// remove wrong image
			$li.querySelectorAll('img').forEach($img => {
				if ($img.getAttribute('alt') === item.type) return;
				$img.remove();
			});

			// populate link
			const $a = $li.querySelector('a');
			$a.setAttribute('href', item.href);
			$a.textContent = item.title;

			// attach list item
			$node.appendChild($li);
		}
	});

	port.postMessage({type: 'POPUP_INIT', tabId: currentTab.id});
}

main().catch(console.error)
