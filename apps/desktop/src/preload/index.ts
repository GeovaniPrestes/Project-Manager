import { contextBridge, ipcRenderer } from 'electron'

import {
    PROJECT_IPC_CHANNELS,
    TASK_IPC_CHANNELS,
    type ProjectApi,
    type TaskApi
} from '@project-manager/shared'

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

const projectApi: ProjectApi = {
    getAll: (type) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.GET_ALL, type),

    create: (data) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.CREATE, data),

    update: (id, data) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE, id, data),

    delete: (id) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.DELETE, id),

    updateStatus: (id, status) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE_STATUS, id, status)
}

const taskApi: TaskApi = {
    getAll: (projectId) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.GET_ALL, projectId),

    create: (data) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.CREATE, data),

    update: (id, data) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.UPDATE, id, data),

    delete: (id) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.DELETE, id),

    updateStatus: (id, status) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.UPDATE_STATUS, id, status)
}

contextBridge.exposeInMainWorld('projectApi', projectApi)
contextBridge.exposeInMainWorld('taskApi', taskApi)
