import { ipcMain } from 'electron'

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus
} from '../services/ProjectService.js'

export function registerProjectsIpc(): void {
    ipcMain.handle('projects:get-all', async () => {
        return getProjects()
    })

    ipcMain.handle('projects:create', async (_event, data) => {
        return createProject(data)
    })

    ipcMain.handle('projects:update', async (_event, id, data) => {
        return updateProject(id, data)
    })

    ipcMain.handle('projects:delete', async (_event, id) => {
        return deleteProject(id)
    })

    ipcMain.handle('projects:update-status', async (_event, id, status) => {
        return updateProjectStatus(id, status)
    })
}