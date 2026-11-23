import { app, BrowserWindow } from 'electron'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1000,
        minHeight: 650,
        show: false,
        backgroundColor: '#111318',
        webPreferences: {
            preload: join(currentDir, '../preload/index.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    if (process.env.ELECTRON_RENDERER_URL) {
        void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
        void mainWindow.loadFile(
            join(currentDir, '../renderer/index.html')
        )
    }
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
