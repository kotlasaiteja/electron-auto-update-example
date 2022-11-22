const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path')

log.transports.file.resolvePath = () => path.join('D:/git-hub/electron-auto-update-example', 'logs/main.log');
log.log('current version' + app.getVersion());

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    log.info('ready-to-show');
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
  log.info('checking for updates and notify');
  autoUpdater.checkForUpdatesAndNotify();

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  log.info('update-available');
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded');
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  log.info('restart_app');
  autoUpdater.quitAndInstall();
});

autoUpdater.on("checking-for-update", () => {
  log.info('checking-for-update');
});

autoUpdater.on("update-not-available", () => {
  log.info('update-not-available');
});

autoUpdater.on("error", (err) => {
  log.info('error' + err);
});

autoUpdater.on("download-progress", (progressTrack) => {
  log.info('download-progress');
  log.info('progressTrack' + progressTrack);
});

