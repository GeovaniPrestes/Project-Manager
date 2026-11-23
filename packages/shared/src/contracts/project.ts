import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus,
    ProjectData,
    ProjectType
} from '../types/project.js'

export interface ProjectApi {
    getAll: (type?: ProjectType) => Promise<ProjectData[]>
    create: (data: CreateProjectData) => Promise<ProjectData>
    update: (id: number, data: UpdateProjectData) => Promise<ProjectData>
    delete: (id: number) => Promise<{ success: boolean }>
    updateStatus: (id: number, status: ProjectStatus) => Promise<ProjectData>
}
