const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(' http://localhost:3000/  '); // 假设你的 Vue 应用在此端口运行
}

app.on('ready', createWindow);
