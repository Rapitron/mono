const { app, BrowserWindow } = require('electron')
const path = require("path");
const fs = require("fs");

let mainWindow

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

  mainWindow.loadURL('http://localhost:3000'
    // url.format({
    //   pathname: path.join(__dirname, `/dist/index.html`),
    //   protocol: "file:",
    //   slashes: true
    // })
  );

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

// const { app, BrowserWindow } = require('electron')
// const path = require('path')

// function createWindow () {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//     //   preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   win.loadFile('src/index.html')
// }

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })