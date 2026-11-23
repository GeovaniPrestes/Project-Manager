import { contextBridge, ipcRenderer } from 'electron'

interface CreateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

contextBridge.exposeInMainWorld('projectApi', {
    getAll: () => ipcRenderer.invoke('projects:get-all'),

    create: (data: CreateProjectData) =>
        ipcRenderer.invoke('projects:create', data),

    update: (id: number, data: CreateProjectData) =>
        ipcRenderer.invoke('projects:update', id, data),
})
