
import { ipcMain } from 'electron'

import {
    TIMER_IPC_CHANNELS,
    type CreateTimerSessionData
} from '@project-manager/shared'

import {
    getActiveTimerSession,
    startTimerSession,
    pauseTimerSession,
    resumeTimerSession,
    finishTimerSession,
    cancelTimerSession
} from '../services/TimerService.js'

export function registerTimerIpc(): void {
    ipcMain.handle(
        TIMER_IPC_CHANNELS.GET_ACTIVE,
        async () => {
            return getActiveTimerSession()
        }
    )

    ipcMain.handle(
        TIMER_IPC_CHANNELS.START,
        async (_event, data: CreateTimerSessionData) => {
            if (!data || typeof data !== 'object') {
                throw new Error('Dados de criação da sessão inválidos.')
            }

            return startTimerSession(data)
        }
    )

    ipcMain.handle(
        TIMER_IPC_CHANNELS.PAUSE,
        async () => {
            return pauseTimerSession()
        }
    )

    ipcMain.handle(
        TIMER_IPC_CHANNELS.RESUME,
        async () => {
            return resumeTimerSession()
        }
    )

    ipcMain.handle(
        TIMER_IPC_CHANNELS.FINISH,
        async () => {
            return finishTimerSession()
        }
    )

    ipcMain.handle(
        TIMER_IPC_CHANNELS.CANCEL,
        async () => {
            return cancelTimerSession()
        }
    )
}
