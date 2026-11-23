import type {
    CreateTaskData,
    UpdateTaskData,
    TaskStatus,
    TaskData
} from '../types/task.js'

export interface TaskApi {
    getAll: (projectId?: number) => Promise<TaskData[]>
    create: (data: CreateTaskData) => Promise<TaskData>
    update: (id: number, data: UpdateTaskData) => Promise<TaskData>
    delete: (id: number) => Promise<{ success: boolean }>
    updateStatus: (id: number, status: TaskStatus) => Promise<TaskData>
}
