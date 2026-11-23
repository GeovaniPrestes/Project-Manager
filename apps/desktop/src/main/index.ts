
import { app, BrowserWindow, ipcMain } from 'electron'
import { getProjects } from './services/ProjectService.js'
import { join } from 'node:path'

import { database } from './database/index.js'
import './database/models/index.js'

const currentDir = import.meta.dirname

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

app.whenReady().then(async () => {
  try {
    await database.authenticate()
    console.info('[Database] Conexão estabelecida com sucesso.')

    await database.sync()
    console.info('[Database] Modelos sincronizados com sucesso.')

    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })

    ipcMain.handle('projects:get-all', async () => {
      return getProjects()
    })

  } catch (error) {
    console.error('[Database] Falha ao inicializar o banco:', error)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
