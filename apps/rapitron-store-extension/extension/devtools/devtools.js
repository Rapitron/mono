const options = {
    title: 'Rapitron | Store',
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