// let port;

// chrome.runtime.onConnect.addListener(_port => {
//     console.log('Rapitron Store Connection Successful');
//     port = _port;
//     port.onMessage.addListener(data => {
//         console.log('Data from ext', data);
//     });
// });

chrome.runtime.onMessage.addListener(message => document.dispatchEvent(new MessageEvent('rse', message)));
document.addEventListener('rse', event => chrome.runtime.sendMessage(event.data));