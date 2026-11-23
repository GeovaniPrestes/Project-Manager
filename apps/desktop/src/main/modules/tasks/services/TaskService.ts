import Task from '../database/Task.js'
import Project from '../../projects/database/Project.js'

import type {
    CreateTaskData,
    UpdateTaskData,
    TaskPriority,
    TaskStatus
} from '@project-manager/shared'

export async function getTasks(projectId?: number) {
    if (projectId !== undefined) {
        validateId(projectId)
    }

    const tasks = await Task.findAll({
        where: projectId !== undefined ? { projectId } : undefined,
        order: [['createdAt', 'ASC']]
    })

    return tasks.map(task => task.toJSON())
}

export async function createTask(data: CreateTaskData) {
    validateId(data.projectId)
    validateTaskTitle(data.title)
    validateTaskPriority(data.priority)
    validateDueDate(data.dueDate)

    const project = await Project.findByPk(data.projectId)

    if (!project) {
        throw new Error('Projeto não encontrado ou excluído.')
    }

    const task = await Task.create({
        projectId: data.projectId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        priority: data.priority ?? 'medium',
        status: 'pending',
        dueDate: data.dueDate ?? null,
        completedAt: null
    })

    return task.toJSON()
}

export async function updateTask(id: number, data: UpdateTaskData) {
    validateId(id)
    validateTaskTitle(data.title)
    validateTaskPriority(data.priority)
    validateDueDate(data.dueDate)

    const task = await Task.findByPk(id)

    if (!task) {
        throw new Error(`Tarefa com ID ${id} não encontrada.`)
    }

    await task.update({
        title: data.title.trim(),
        description: data.description?.trim() || null,
        priority: data.priority ?? task.priority,
        dueDate: data.dueDate ?? null
    })

    return task.toJSON()
}

export async function deleteTask(id: number) {
    validateId(id)

    const task = await Task.findByPk(id)

    if (!task) {
        throw new Error(`Tarefa com ID ${id} não encontrada.`)
    }

    await task.destroy()

    return { success: true }
}

export async function updateTaskStatus(
    id: number,
    status: TaskStatus
) {
    validateId(id)
    validateTaskStatus(status)

    const task = await Task.findByPk(id)

    if (!task) {
        throw new Error(`Tarefa com ID ${id} não encontrada.`)
    }

    await task.update({
        status,
        completedAt: status === 'completed' ? new Date() : null
    })

    return task.toJSON()
}

function validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Identificador inválido.')
    }
}

function validateTaskTitle(title: string): void {
    if (typeof title !== 'string' || !title.trim()) {
        throw new Error('O título da tarefa não pode ficar vazio.')
    }
}

function validateTaskPriority(priority?: TaskPriority): void {
    if (
        priority !== undefined &&
        priority !== 'low' &&
        priority !== 'medium' &&
        priority !== 'high' &&
        priority !== 'urgent'
    ) {
        throw new Error('Prioridade da tarefa inválida.')
    }
}

function validateTaskStatus(status: TaskStatus): void {
    if (
        status !== 'pending' &&
        status !== 'in_progress' &&
        status !== 'in_review' &&
        status !== 'reopened' &&
        status !== 'completed' &&
        status !== 'cancelled'
    ) {
        throw new Error('Status da tarefa inválido.')
    }
}

function validateDueDate(dueDate?: Date | null): void {
    if (
        dueDate !== undefined &&
        dueDate !== null &&
        (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime()))
    ) {
        throw new Error('Data de vencimento inválida.')
    }
}
