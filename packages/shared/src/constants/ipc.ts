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
    UPDATE_STATUS: 'tasks:update-status',

    GET_CHECKLIST: 'tasks:get-checklist',
    CREATE_CHECKLIST_ITEM: 'tasks:create-checklist-item',
    UPDATE_CHECKLIST_ITEM: 'tasks:update-checklist-item',
    TOGGLE_CHECKLIST_ITEM: 'tasks:toggle-checklist-item',
    DELETE_CHECKLIST_ITEM: 'tasks:delete-checklist-item'
} as const

export const TIMER_IPC_CHANNELS = {
    GET_ACTIVE: 'timer:get-active',
    START: 'timer:start',
    PAUSE: 'timer:pause',
    RESUME: 'timer:resume',
    FINISH: 'timer:finish',
    CANCEL: 'timer:cancel',
    UPDATE: 'timer:update'
} as const
