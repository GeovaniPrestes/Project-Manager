import Project from '../database/Project.js'

import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus
} from '@project-manager/shared'

export async function getProjects(includeDeleted = false) {
    const projects = await Project.findAll({
        paranoid: !includeDeleted,
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


    validateProjectName(data.name)
    validateWeeklyGoal(data.weeklyGoal)

    return project.toJSON()
}

export async function updateProject(id: number, data: UpdateProjectData) {
    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    validateProjectName(data.name)
    validateWeeklyGoal(data.weeklyGoal)

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
    status: ProjectStatus
) {
    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    await project.update({ status })

    return project.toJSON()
}

function validateProjectName(name: string): void {
    if (!name.trim()) {
        throw new Error('O nome do projeto não pode ficar vazio.')
    }
}

function validateWeeklyGoal(weeklyGoal?: number): void {
    if (weeklyGoal === undefined) {
        return
    }

    if (!Number.isFinite(weeklyGoal) || weeklyGoal < 0) {
        throw new Error(
            'A meta semanal deve ser um número válido e não negativo.'
        )
    }
}
