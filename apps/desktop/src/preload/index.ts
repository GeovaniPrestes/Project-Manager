import { contextBridge, ipcRenderer } from 'electron'

import {
    PROJECT_IPC_CHANNELS,
    type ProjectApi
} from '@project-manager/shared'

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

const projectApi: ProjectApi = {
    getAll: () => ipcRenderer.invoke(PROJECT_IPC_CHANNELS.GET_ALL),

    create: (data) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.CREATE, data),

    update: (id, data) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE, id, data),

    delete: (id) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.DELETE, id),

    updateStatus: (id, status) =>
        ipcRenderer.invoke(PROJECT_IPC_CHANNELS.UPDATE_STATUS, id, status),
}

contextBridge.exposeInMainWorld('projectApi', projectApi)
