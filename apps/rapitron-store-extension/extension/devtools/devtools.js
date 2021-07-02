const options = {
    title: 'RStore',
    icon: null,
    file: 'devtools/panel.html',
    callback: () => {}
};

chrome.devtools.panels.create(
    options.title,
    options.icon,
    options.file,
    options.callback
);