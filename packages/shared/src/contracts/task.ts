import type {
    CreateTaskData,
    UpdateTaskData,
    TaskStatus,
    TaskData,
    CreateChecklistItemData,
    UpdateChecklistItemData,
    ChecklistItemData
} from '../types/task.js'

export interface TaskApi {
    getAll: (projectId?: number) => Promise<TaskData[]>
    create: (data: CreateTaskData) => Promise<TaskData>
    update: (id: number, data: UpdateTaskData) => Promise<TaskData>
    delete: (id: number) => Promise<{ success: boolean }>
    updateStatus: (id: number, status: TaskStatus) => Promise<TaskData>

    getChecklist: (taskId: number) => Promise<ChecklistItemData[]>
    createChecklistItem: (data: CreateChecklistItemData) => Promise<ChecklistItemData>
    updateChecklistItem: (id: number, data: UpdateChecklistItemData) => Promise<ChecklistItemData>
    toggleChecklistItem: (id: number) => Promise<ChecklistItemData>
    deleteChecklistItem: (id: number) => Promise<{ success: boolean }>
}
