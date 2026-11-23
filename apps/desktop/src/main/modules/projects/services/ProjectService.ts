import Project from '../database/Project.js'

import type {
    CreateProjectData,
    UpdateProjectData,
    ProjectStatus,
    ProjectType
} from '@project-manager/shared'

export async function getProjects(
    type?: ProjectType,
    includeDeleted = false
) {
    const projects = await Project.findAll({
        where: type ? { type } : undefined,
        paranoid: !includeDeleted,
        order: [['createdAt', 'ASC']]
    })

    return projects.map(project => project.toJSON())
}

export async function createProject(data: CreateProjectData) {
    validateProjectName(data.name)
    validateWeeklyGoal(data.weeklyGoal)
    validateProjectType(data.type)

    const project = await Project.create({
        name: data.name.trim(),
        description: data.description?.trim() || null,
        type: data.type ?? 'personal',
        category: data.category?.trim() || null,
        color: data.color ?? '#6489ed',
        weeklyGoal: data.weeklyGoal ?? 0,
        status: 'active'
    })

    return project.toJSON()
}

export async function updateProject(id: number, data: UpdateProjectData) {
    validateId(id)
    validateProjectName(data.name)
    validateWeeklyGoal(data.weeklyGoal)

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
    validateId(id)

    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    // Exclusão lógica: preserva o registro e seu histórico no banco.
    await project.destroy()

    return { success: true }
}

export async function updateProjectStatus(
    id: number,
    status: ProjectStatus
) {
    validateId(id)
    validateProjectStatus(status)

    const project = await Project.findByPk(id)

    if (!project) {
        throw new Error(`Projeto com ID ${id} não encontrado.`)
    }

    await project.update({ status })

    return project.toJSON()
}

function validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Identificador do projeto inválido.')
    }
}

function validateProjectName(name: string): void {
    if (typeof name !== 'string' || !name.trim()) {
        throw new Error('O nome do projeto não pode ficar vazio.')
    }
}

function validateWeeklyGoal(weeklyGoal?: number): void {
    if (weeklyGoal === undefined) {
        return
    }

    if (
        typeof weeklyGoal !== 'number' ||
        !Number.isFinite(weeklyGoal) ||
        weeklyGoal < 0
    ) {
        throw new Error(
            'A meta semanal deve ser um número válido e não negativo.'
        )
    }
}

function validateProjectType(type?: ProjectType): void {
    if (type !== undefined && type !== 'personal' && type !== 'commission') {
        throw new Error('Tipo de projeto inválido.')
    }
}

function validateProjectStatus(status: ProjectStatus): void {
    if (
        status !== 'active' &&
        status !== 'paused' &&
        status !== 'completed'
    ) {
        throw new Error('Status do projeto inválido.')
    }
}
