const port = chrome.runtime.connect({name: 'link-counter'});

console.log('💈 Content script loaded for', chrome.runtime.getManifest().name);

const SUPPORTED_TYPES = ['application/rss+xml', 'application/atom+xml', 'application/feed+json'];

const nodes = new Map();
for (const node of document.querySelectorAll('head link[rel=alternate]')) {
	const type = node.getAttribute('type')?.trim();
	const href = node.getAttribute('href')?.trim();
	const title = node.getAttribute('title')?.trim();

	if (!SUPPORTED_TYPES.includes(type)) continue;

	nodes.set(`${type}-${href}-${title}`, {type, href, title});
}

port.postMessage({
	type: 'SET_INFO_TAB',
	data: Array.from(nodes.values()),
});
