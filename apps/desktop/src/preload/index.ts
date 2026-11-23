import { contextBridge, ipcRenderer } from 'electron'
import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus
} from '@project-manager/shared'
import {    PROJECT_IPC_CHANNELS} from '@project-manager/shared'

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

contextBridge.exposeInMainWorld('projectApi', {
    getAll: () => ipcRenderer.invoke(PROJECT_IPC_CHANNELS.GET_ALL),

    create: (data: CreateProjectData) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.CREATE, data),

    update: (id: number, data: UpdateProjectData) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE, id, data),

    delete: (id: number) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.DELETE, id),

    updateStatus: (id: number, status: ProjectStatus) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE_STATUS, id, status),
})
