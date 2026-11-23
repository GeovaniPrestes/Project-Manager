export const PROJECT_IPC_CHANNELS = {
    GET_ALL: 'projects:get-all',
    CREATE: 'projects:create',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
    UPDATE_STATUS: 'projects:update-status'
} as const

export const TASK_IPC_CHANNELS = {
    GET_ALL: 'tasks:get-all',
    CREATE: 'tasks:create',
    UPDATE: 'tasks:update',
    DELETE: 'tasks:delete',
    UPDATE_STATUS: 'tasks:update-status'
} as const
