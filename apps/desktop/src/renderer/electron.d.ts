export { }

declare global {
    interface Window {
        appInfo: {
            platform: string
        }

        projectApi: {
            getAll: () => Promise<{
                id: number
                name: string
                description: string | null
                category: string | null
                color: string
                weeklyGoal: number
                status: 'active' | 'paused' | 'completed'
                createdAt: Date
                updatedAt: Date
            }[]>

            create: (data: {
                name: string
                description?: string | null
                category?: string | null
                color?: string
                weeklyGoal?: number
            }) => Promise<{
                id: number
                name: string
                description: string | null
                category: string | null
                color: string
                weeklyGoal: number
                status: 'active' | 'paused' | 'completed'
                createdAt: Date
                updatedAt: Date
            }>

            update: (id: number, data: {
                name: string
                description?: string | null
                category?: string | null
                color?: string
                weeklyGoal?: number
            }) => Promise<{
                id: number
                name: string
                description: string | null
                category: string | null
                color: string
                weeklyGoal: number
                status: 'active' | 'paused' | 'completed'
                createdAt: Date
                updatedAt: Date
            }>
        }
    }
}
