import Project from '../database/models/Project.js'

export async function getProjects() {
    const projects = await Project.findAll({
        order: [['createdAt', 'ASC']]
    })

    return projects.map(project => project.toJSON())
}

interface CreateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

export async function createProject(data: CreateProjectData) {
    const project = await Project.create({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        category: data.category?.trim() || null,
        color: data.color ?? '#6489ed',
        weeklyGoal: data.weeklyGoal ?? 0,
        status: 'active'
    })

    return project.toJSON()
}
