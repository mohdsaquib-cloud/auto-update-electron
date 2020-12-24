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
        : path.resolve(__dirname, "../../build/index.html");

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
    console.log(text);
    if (mainWindow) {
        mainWindow.webContents.send("message", text);
    }
};

autoUpdater.on("checking-for-update", () => {
    sendStatusToWindow("Checking for update...");
});
ipcMain.on("checkForUpdate", (evt, arg) => {
    // autoUpdater.updateConfigPath = path.join(
    //     __dirname,
    //     "../../dev-app-update.yml"
    // );
    autoUpdater.checkForUpdates();
});
// setInterval(() => {
//     autoUpdater.checkForUpdates();
// }, 5000);

// download(mainWindow, urlToNupkg, {
//     directory: global.tempPath,
//     onProgress: (progress) =>
//         mainWindow.webContents.send("downloadProgress", progress),
// });

autoUpdater.on("update-available", (info) => {
    console.log(info);
    sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
    console.log(info);
    sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", (err) => {
    console.log(info);
    sendStatusToWindow(`Error in auto-updater: ${err.toString()}`);
});
autoUpdater.on("download-progress", (progressObj) => {
    sendStatusToWindow(
        `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}% (${progressObj.transferred} + '/' + ${progressObj.total} + )`
    );
});
autoUpdater.on("update-downloaded", (info) => {
    console.log(info);
    sendStatusToWindow("Update downloaded; will install now");
});

autoUpdater.on("update-downloaded", (info) => {
    console.log(info);
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 500 ms.
    // You could call autoUpdater.quitAndInstall(); immediately
    autoUpdater.quitAndInstall();
});
