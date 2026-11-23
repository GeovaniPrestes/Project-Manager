import { ipcMain } from 'electron'
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus
} from '../services/ProjectService.js'

import type {    CreateProjectData,    UpdateProjectData,    ProjectStatus} from '@project-manager/shared'

import { PROJECT_IPC_CHANNELS } from '@project-manager/shared'

export function registerProjectsIpc(): void {
    ipcMain.handle(PROJECT_IPC_CHANNELS.GET_ALL, async (_event) => {
        return getProjects()
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.CREATE, async (_event, data: CreateProjectData) => {
        return createProject(data)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.UPDATE, async (_event, id: number, data: UpdateProjectData) => {
        return updateProject(id, data)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.DELETE, async (_event, id: number) => {
        return deleteProject(id)
    })

    ipcMain.handle(PROJECT_IPC_CHANNELS.UPDATE_STATUS, async (_event, id: number, status: ProjectStatus) => {
        return updateProjectStatus(id, status)
    })
}