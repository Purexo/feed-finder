// eslint-disable-next-line import/no-unassigned-import
import './options-storage.js';

chrome.runtime.onInstalled.addListener((details) => {
	chrome.action.disable().catch(console.error);
})

const LINKS_BY_TAB = new Map();
chrome.runtime.onConnect.addListener(port => {
	if (port.name !== 'link-counter') return;

	const tabId = port.sender.tab?.id;
	port.onMessage.addListener((message) => {
		if (message.type !== 'SET_INFO_TAB') return;

		const length = message.data.length;
		if (!length) return;

		LINKS_BY_TAB.set(tabId, message.data)

		const text = length > 9999 ? '999+' : String(length);
		chrome.action.enable(tabId)
			.then(() => chrome.action.setBadgeText({text, tabId}))
			.catch(console.error);
	});

	port.onDisconnect.addListener(() => {
		LINKS_BY_TAB.delete(tabId);
	});
});

chrome.runtime.onConnect.addListener(port => {
	if (port.name !== 'popup-page') return;

	port.onMessage.addListener(message => {
		if (message.type !== 'POPUP_INIT') return;

		port.postMessage({type: 'POPUP_INIT_RESPONSE', data: LINKS_BY_TAB.get(message.tabId) ?? []})
	});
})
