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
