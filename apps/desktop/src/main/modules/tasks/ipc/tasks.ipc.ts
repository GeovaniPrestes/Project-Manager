import { ipcMain } from 'electron'

import {
    TASK_IPC_CHANNELS,
    type CreateTaskData,
    type UpdateTaskData,
    type TaskStatus,
    type CreateChecklistItemData,
    type UpdateChecklistItemData
} from '@project-manager/shared'

import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} from '../services/TaskService.js'

import ChecklistService from '../services/ChecklistService.js'

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

    ipcMain.handle(
        TASK_IPC_CHANNELS.GET_CHECKLIST,
        async (_event, taskId: number) => {
            if (!Number.isInteger(taskId) || taskId <= 0) {
                throw new Error('ID da tarefa inválido.')
            }

            return ChecklistService.getAll(taskId)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.CREATE_CHECKLIST_ITEM,
        async (_event, data: CreateChecklistItemData) => {
            console.log('[Checklist IPC] Dados recebidos:', data)

            if (
                !data ||
                !Number.isInteger(data.taskId) ||
                data.taskId <= 0 ||
                typeof data.title !== 'string' ||
                !data.title.trim()
            ) {
                throw new Error('Dados de criação do checklist inválidos.')
            }

            const result = await ChecklistService.create(data)

            console.log('[Checklist IPC] Item criado:', result.toJSON())

            return result
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.UPDATE_CHECKLIST_ITEM,
        async (_event, id: number, data: UpdateChecklistItemData) => {
            if (
                !Number.isInteger(id) ||
                id <= 0 ||
                !data ||
                typeof data.title !== 'string' ||
                !data.title.trim()
            ) {
                throw new Error('Dados de atualização do checklist inválidos.')
            }

            return ChecklistService.update(id, data.title)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.TOGGLE_CHECKLIST_ITEM,
        async (_event, id: number) => {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID do item inválido.')
            }

            return ChecklistService.toggle(id)
        }
    )

    ipcMain.handle(
        TASK_IPC_CHANNELS.DELETE_CHECKLIST_ITEM,
        async (_event, id: number) => {
            if (!Number.isInteger(id) || id <= 0) {
                throw new Error('ID do item inválido.')
            }

            return ChecklistService.delete(id)
        }
    )
}
