import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus,
    ProjectData
} from '@project-manager/shared'

export { }

declare global {
    interface Window {
        appInfo: {
            platform: string
        }

        projectApi: {
            getAll: () => Promise<ProjectData[]>
            create: (data: CreateProjectData) => Promise<ProjectData>
            update: (id: number, data: UpdateProjectData) => Promise<ProjectData>
            delete: (id: number) => Promise<{ success: boolean }>
            updateStatus: (id: number, status: ProjectStatus) => Promise<ProjectData>
        }
    }
}
