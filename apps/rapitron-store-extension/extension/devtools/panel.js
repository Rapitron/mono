// let port = chrome.runtime.connect({ name: 'rapitron-store' });
// port.onMessage.addListener(data => {
//     console.log('Data from content', data);
// });

// document.addEventListener('ext-test', event => {
//     console.log('CHROME ETX', chrome, event);
//     port.postMessage(event.data);
// });

// chrome.tabs.query({ currentWindow: true, active: true }, function ([tab]) {
//     chrome.tabs.executeScript({
//         file: 'devtools/content-script.js'
//     })
// });
// chrome.devtools.panels.create('Rapitron Store', null, "devtools/panel.html", null);

// document.addEventListener('rse', async event => {
//     chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//         chrome.tabs.sendMessage(tab.id, event.data);
//     });
// });

