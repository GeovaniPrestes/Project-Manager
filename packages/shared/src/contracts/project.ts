import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus,
    ProjectData
} from '../types/project.js'

export interface ProjectApi {
    getAll: () => Promise<ProjectData[]>
    create: (data: CreateProjectData) => Promise<ProjectData>
    update: (id: number, data: UpdateProjectData) => Promise<ProjectData>
    delete: (id: number) => Promise<{ success: boolean }>
    updateStatus: (id: number, status: ProjectStatus) => Promise<ProjectData>
}
