import Project from '../database/models/Project.js'

interface CreateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

interface UpdateProjectData {
    name: string
    description?: string | null
    category?: string | null
    color?: string
    weeklyGoal?: number
}

export async function getProjects() {
    const projects = await Project.findAll({
        order: [['createdAt', 'ASC']]
    })

    return projects.map(project => project.toJSON())
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

export async function updateProject(
    id: number,
    data: UpdateProjectData
) {
    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    await project.update({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        category: data.category?.trim() || null,
        color: data.color ?? project.color,
        weeklyGoal: data.weeklyGoal ?? project.weeklyGoal
    })

    return project.toJSON()
}

export async function deleteProject(id: number) {
    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    await project.destroy()

    return { success: true }
}

export async function updateProjectStatus(
    id: number,
    status: 'active' | 'paused' | 'completed'
) {
    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    await project.update({ status })

    return project.toJSON()
}
