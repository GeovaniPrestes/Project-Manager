export type ProjectType = 'personal' | 'commission'

export type ProjectStatus = 'active' | 'paused' | 'completed'

export interface CreateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

export interface UpdateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

export interface ProjectData {
    id: number
    name: string
    description: string | null
    category: string | null
    color: string
    weeklyGoal: number
    status: ProjectStatus
    createdAt: Date
    updatedAt: Date
}