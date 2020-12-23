const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
let mainWindow;
const { autoUpdater } = require("electron-updater");
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    let startUrl = process.env.url
        ? process.env.url
        : path.resolve(__dirname, "../build/index.html");

    mainWindow.loadURL(startUrl);
    console.log(startUrl);
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
    ipcMain.on("dashboard", (evt, msg) => {
        console.log(msg);
    });
}

app.on("ready", createWindow);
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

const sendStatusToWindow = (text) => {
    log.info(text);
    if (mainWindow) {
        mainWindow.webContents.send("message", text);
    }
};

autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
    sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
    sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
    sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on("download-progress", (progressObj) => {
    sendStatusToWindow(
        `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
    );
});
autoUpdater.on("update-downloaded", (info) => {
    sendStatusToWindow("Update downloaded; will install now");
});

autoUpdater.on("update-downloaded", (info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 500 ms.
    // You could call autoUpdater.quitAndInstall(); immediately
    autoUpdater.quitAndInstall();
});
