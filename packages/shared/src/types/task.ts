export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskStatus =
    | 'pending'
    | 'in_progress'
    | 'in_review'
    | 'reopened'
    | 'completed'
    | 'cancelled'

export interface CreateTaskData {
    projectId: number
    title: string
    description?: string | null
    priority?: TaskPriority
    dueDate?: Date | null
}

export interface UpdateTaskData {
    title: string
    description?: string | null
    priority?: TaskPriority
    dueDate?: Date | null
}

export interface TaskData {
    id: number
    projectId: number
    title: string
    description: string | null
    priority: TaskPriority
    status: TaskStatus
    dueDate: Date | null
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export interface CreateChecklistItemData {
    taskId: number
    title: string
}

export interface UpdateChecklistItemData {
    title: string
}

export interface ChecklistItemData {
    id: number
    taskId: number
    title: string
    completed: boolean
    createdAt: Date
    updatedAt: Date
}
