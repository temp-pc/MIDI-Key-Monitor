const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')



function createWindow () {
  const mainWindow = new BrowserWindow({
    width : 1000,
    height : 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('index.html')
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
  }
});

// app.whenReady().then(() => {
//   ipcMain.on('set-title', handleSetTitle)
//   createWindow()
// })
// ...