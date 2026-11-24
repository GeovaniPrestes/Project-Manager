import { contextBridge, ipcRenderer } from 'electron'

import {
    PROJECT_IPC_CHANNELS,
    TASK_IPC_CHANNELS,
    TIMER_IPC_CHANNELS,
    type ProjectApi,
    type TaskApi,
    type TimerApi
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
        ipcRenderer.invoke(TASK_IPC_CHANNELS.UPDATE_STATUS, id, status),

    getChecklist: (taskId) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.GET_CHECKLIST, taskId),

    createChecklistItem: (data) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.CREATE_CHECKLIST_ITEM, data),

    updateChecklistItem: (id, data) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.UPDATE_CHECKLIST_ITEM, id, data),

    toggleChecklistItem: (id) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.TOGGLE_CHECKLIST_ITEM, id),

    deleteChecklistItem: (id) =>
        ipcRenderer.invoke(TASK_IPC_CHANNELS.DELETE_CHECKLIST_ITEM, id)
}

const timerApi: TimerApi = {
    getActive: () =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.GET_ACTIVE),

    start: (data) =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.START, data),

    pause: () =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.PAUSE),

    resume: () =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.RESUME),

    finish: () =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.FINISH),

    cancel: () =>
        ipcRenderer.invoke(TIMER_IPC_CHANNELS.CANCEL),

    onUpdate: (callback) => {
        const listener = (
            _event: Electron.IpcRendererEvent,
            session: Parameters<typeof callback>[0]
        ) => callback(session)

        ipcRenderer.on(TIMER_IPC_CHANNELS.UPDATE, listener)

        return () => {
            ipcRenderer.removeListener(TIMER_IPC_CHANNELS.UPDATE, listener)
        }
    }
}

contextBridge.exposeInMainWorld('projectApi', projectApi)
contextBridge.exposeInMainWorld('taskApi', taskApi)
contextBridge.exposeInMainWorld('timerApi', timerApi)
