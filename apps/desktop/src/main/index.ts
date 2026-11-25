import { app, BrowserWindow } from 'electron'

import { registerIpcHandlers } from './core/ipc/index.js'
import { createMainWindow, getMainWindow } from './core/window.js'
import { createTray } from './core/tray.js'
import { initializeDatabase } from './database/initialize.js'

import {
    pauseTimerOnShutdown,
    recoverInterruptedTimerSession,
    getActiveTimerSession
} from './modules/timer/services/TimerService.js'

let isQuitting = false

app.whenReady().then(async () => {
    try {
        await initializeDatabase()

        await recoverInterruptedTimerSession()

        registerIpcHandlers()

        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }

        const mainWindow = getMainWindow()

        if (mainWindow) {
            let allowClose = false
            let checkingClose = false

            mainWindow.on('close', (event) => {
                if (allowClose || isQuitting) {
                    return
                }

                event.preventDefault()

                if (checkingClose) {
                    return
                }

                checkingClose = true

                void getActiveTimerSession()
                    .then((session) => {
                        if (session) {
                            createTray()
                            mainWindow.hide()

                            console.info(
                                '[Tray] Janela ocultada com sessão ativa.'
                            )

                            return
                        }

                        allowClose = true
                        mainWindow.close()
                    })
                    .catch((error) => {
                        console.error(
                            '[Tray] Erro ao verificar sessão do Timer:',
                            error
                        )

                        allowClose = true
                        mainWindow.close()
                    })
                    .finally(() => {
                        checkingClose = false
                    })
            })
        }
    } catch (error) {
        console.error(
            '[Database] Falha ao inicializar o banco:',
            error
        )

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
            console.error(
                '[Timer] Erro ao pausar durante encerramento:',
                error
            )
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
