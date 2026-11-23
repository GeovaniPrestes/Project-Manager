import { ipcMain } from 'electron'
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus
} from '../services/ProjectService.js'
import { PROJECT_IPC_CHANNELS } from '@project-manager/shared'

export function registerProjectsIpc(): void {
    ipcMain.handle(PROJECT_IPC_CHANNELS.GET_ALL, async () => {
        return getProjects()
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.CREATE, async (_event, data) => {
        return createProject(data)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.UPDATE, async (_event, id, data) => {
        return updateProject(id, data)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.DELETE, async (_event, id) => {
        return deleteProject(id)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.UPDATE_STATUS, async (_event, id, status) => {
        return updateProjectStatus(id, status)
    })
}