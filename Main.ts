import {BrowserWindow} from 'electron';
const {ipcMain} = require('electron')

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') Main.application.quit();
    }

    private static onClose(){
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onReady(){
        ipcMain.on('ui-notifications"', (event, arg) => {
            console.log(arg)  // prints "ping"
        });
        Main.mainWindow =  new Main.BrowserWindow({width: 800, height: 600})
        var indexUrl = `file://${__dirname}/index.html`;
        Main.mainWindow.loadURL(indexUrl);
        Main.mainWindow.webContents.openDevTools();
        Main.mainWindow.on('closed', Main.onClose);

    }

    static main(
        app: Electron.App,
        browserWindow: typeof BrowserWindow){
        // we pass the Electron.App object and the 
        // Electron.BrowserWindow into this function
        // so this class1 has no dependencies.  This
        // makes the code easier to write tests for

        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}