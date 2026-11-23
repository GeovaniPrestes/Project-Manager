
import { app, BrowserWindow } from 'electron'

import { registerIpcHandlers } from './core/ipc/index.js'
import { createMainWindow } from './core/window.js'
import { initializeDatabase } from './database/initialize.js'

app.whenReady().then(async () => {
  try {
    await initializeDatabase()

    registerIpcHandlers()
    
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
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
