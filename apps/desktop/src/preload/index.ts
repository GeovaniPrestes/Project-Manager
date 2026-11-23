import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('appInfo', {
    platform: process.platform
})

contextBridge.exposeInMainWorld('projectApi', {
    getAll: () => ipcRenderer.invoke('projects:get-all')
})
