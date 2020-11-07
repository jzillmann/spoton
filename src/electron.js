const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { parseKnownFiles } = require('@aws-sdk/credential-provider-ini');
const { tt } = require('@aws-sdk/node-config-provider');
const { resolveRegionConfig } = require('@aws-sdk/config-resolver');
const { loadSharedConfigFiles } = require('@aws-sdk/shared-ini-file-loader');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    const mode = process.env.NODE_ENV;
    console.log('mode: ' + mode);

    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
    });
    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        titleBarStyle: 'hidden',
        trafficLightPosition: {
            x: 10,
            y: 20,
        },
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindowState.manage(mainWindow);

    let watcher;

    if (mode === 'development') {
        console.log('Watching for changes...');
        // mainWindow.webContents.openDevTools();
        watcher = require('chokidar').watch(path.join(__dirname, '../public/build'), { ignoreInitial: true });
        watcher.on('change', () => {
            mainWindow.reload();
        });
    }

    mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
    mainWindow.on('closed', () => {
        mainWindowState.unmanage(mainWindow);
        if (watcher) {
            watcher.close();
        }
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('loadProfilesFromSystem', async (event, arg) => {
    return loadSharedConfigFiles();
});
