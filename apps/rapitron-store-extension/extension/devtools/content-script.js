// let port;

// chrome.runtime.onConnect.addListener(_port => {
//     console.log('Rapitron Store Connection Successful');
//     port = _port;
//     port.onMessage.addListener(data => {
//         console.log('Data from ext', data);
//     });
// });

chrome.runtime.onMessage.addListener(message => {
    if ('type' in message) {
        if (message.type === 'rapitron-store-update') {
            document.dispatchEvent(new MessageEvent('rapitron-store-update', {
                data: message.data
            }));
        }
    }
});

document.addEventListener('rapitron-store', event => {
    chrome.runtime.sendMessage({
        type: 'rapitron-store',
        data: event.data
    });
});