const electron = require('electron'),
      path = require('path'),
      url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow, loadKeysWindow

app.on('ready', () => {
    createMainWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow()   
    }
})

function createMainWindow () { 
    const browserOptions = { 
        width: 800, 
        height: 800, 
        frame: true, 
        show: false, 
        fullscreen: false,
        backgroundColor: '#000000'
    }
    
    mainWindow = new BrowserWindow(browserOptions)	

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}
