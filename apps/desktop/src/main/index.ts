import { app, BrowserWindow } from 'electron'

import { registerIpcHandlers } from './core/ipc/index.js'
import { createMainWindow } from './core/window.js'
import { initializeDatabase } from './database/initialize.js'
import { pauseTimerOnShutdown, recoverInterruptedTimerSession } from './modules/timer/services/TimerService.js'

let isQuitting = false

app.whenReady().then(async () => {
  try {
    await initializeDatabase()

    await recoverInterruptedTimerSession()

    registerIpcHandlers()

    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  } catch (error) {
    console.error('[Database] Falha ao inicializar o banco:', error)
    app.quit()
  }
})

app.on('before-quit', (event) => {
  if (isQuitting) {
    return
  }

  event.preventDefault()

  isQuitting = true

  void pauseTimerOnShutdown()
    .catch((error) => {
      console.error('[Timer] Erro ao pausar durante encerramento:', error)
    })
    .finally(() => {
      app.quit()
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
