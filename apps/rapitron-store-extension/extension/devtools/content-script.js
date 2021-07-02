// let port;

// chrome.runtime.onConnect.addListener(_port => {
//     console.log('Rapitron Store Connection Successful');
//     port = _port;
//     port.onMessage.addListener(data => {
//         console.log('Data from ext', data);
//     });
// });

document.addEventListener('rapitron-store', event => {
    console.log(event);
    chrome.runtime.sendMessage({
        type: 'rapitron-store',
        data: event.data
    });
});