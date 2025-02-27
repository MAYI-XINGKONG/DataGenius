const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const electronReload = require('electron-reload');

// 配置 electron-reload
electronReload(__dirname + '/../', {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform!== 'darwin') app.quit();
});
