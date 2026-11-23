
import { ipcMain } from 'electron'

import {
    TASK_IPC_CHANNELS,
    type CreateTaskData,
    type UpdateTaskData,
    type TaskStatus
} from '@project-manager/shared'

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} from '../services/TaskService.js'

export function registerTasksIpc(): void {
    ipcMain.handle(
        TASK_IPC_CHANNELS.GET_ALL,
        async (_event, projectId?: number) => {
            if (
                projectId !== undefined &&
                (!Number.isInteger(projectId) || projectId <= 0)
            ) {
                throw new Error('ID do projeto inválido.')
            }

            return getTasks(projectId)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.CREATE,
        async (_event, data: CreateTaskData) => {
            if (!data || typeof data !== 'object') {
                throw new Error('Dados de criação inválidos.')
            }

            return createTask(data)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.UPDATE,
        async (_event, id: number, data: UpdateTaskData) => {
            if (!data || typeof data !== 'object') {
                throw new Error('Dados de atualização inválidos.')
            }

            return updateTask(id, data)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.DELETE,
        async (_event, id: number) => {
            return deleteTask(id)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.UPDATE_STATUS,
        async (_event, id: number, status: TaskStatus) => {
            return updateTaskStatus(id, status)
        }
    )
}
