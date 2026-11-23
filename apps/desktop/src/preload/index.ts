import { contextBridge, ipcRenderer } from 'electron'
import type { CreateProjectData } from '@project-manager/shared'

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

contextBridge.exposeInMainWorld('projectApi', {
    getAll: () => ipcRenderer.invoke('projects:get-all'),

    create: (data: CreateProjectData) =>
        ipcRenderer.invoke('projects:create', data),

    update: (id: number, data: CreateProjectData) =>
        ipcRenderer.invoke('projects:update', id, data),

    delete: (id: number) =>
        ipcRenderer.invoke('projects:delete', id),

    updateStatus: (
        id: number,
        status: 'active' | 'paused' | 'completed'
    ) => ipcRenderer.invoke('projects:update-status', id, status),
})
