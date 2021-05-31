const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
const fs = require("fs");
const process = require("process");

process.chdir(process.env.PORTABLE_EXECUTABLE_DIR);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 350,
    frame: false,
    fullscreen: true,
    transparent: true,
    autoHideMenuBar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  // mainWindow.loadURL('http://localhost:3000');
  // mainWindow.loadURL(`C:/Users/rjvvuuren/Desktop/rapi/apps/macro/dist/dist/index.html`);
  mainWindow.loadURL(`${process.env.PORTABLE_EXECUTABLE_DIR}/dist/index.html`);

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
