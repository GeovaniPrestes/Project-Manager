import { ipcMain } from 'electron'

import {
    PROJECT_IPC_CHANNELS,
    type CreateProjectData,
    type UpdateProjectData,
    type ProjectStatus,
    type ProjectType
} from '@project-manager/shared'

import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    updateProjectStatus
} from '../services/ProjectService.js'

export function registerProjectsIpc(): void {
    ipcMain.handle(
    PROJECT_IPC_CHANNELS.GET_ALL,
    async (_event, type?: ProjectType) => {
        return getProjects(type)
    }
)

    ipcMain.handle(
        PROJECT_IPC_CHANNELS.CREATE,
        async (_event, data: CreateProjectData) => {
            return createProject(data)
        }
    )

    ipcMain.handle(
        PROJECT_IPC_CHANNELS.UPDATE,
        async (_event, id: number, data: UpdateProjectData) => {
            return updateProject(id, data)
        }
    )

    ipcMain.handle(
        PROJECT_IPC_CHANNELS.DELETE,
        async (_event, id: number) => {
            return deleteProject(id)
        }
    )

    ipcMain.handle(
        PROJECT_IPC_CHANNELS.UPDATE_STATUS,
        async (_event, id: number, status: ProjectStatus) => {
            return updateProjectStatus(id, status)
        }
    )
}
