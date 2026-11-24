import { BrowserWindow } from 'electron'
import { join } from 'node:path'

let mainWindow: BrowserWindow | null = null

export function getMainWindow(): BrowserWindow | null {
    return mainWindow
}

export function createMainWindow(): void {
    const currentDir = import.meta.dirname

    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1000,
        minHeight: 650,
        show: false,
        backgroundColor: '#111318',
        webPreferences: {
            preload: join(__dirname, '../preload/index.mjs'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false
        }
    })

    mainWindow.once('ready-to-show', () => {
        if(mainWindow == null) return
        
        mainWindow.show()
    })

    if (process.env.ELECTRON_RENDERER_URL) {
        void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
    } else {
        void mainWindow.loadFile(
            join(currentDir, '../../renderer/index.html')
        )
    }
}