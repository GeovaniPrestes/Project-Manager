import TimerSession from '../database/TimerSession.js'
import Project from '../../projects/database/Project.js'
import Task from '../../tasks/database/Task.js'

import type {
    CreateTimerSessionData
} from '@project-manager/shared'

const FOCUS_DURATION_SECONDS = 50 * 60
const BREAK_DURATION_SECONDS = 10 * 60

export async function getActiveTimerSession() {
    const session = await TimerSession.findOne({
        where: {
            status: ['running', 'paused']
        },
        order: [['createdAt', 'DESC']]
    })

    return session ? session.toJSON() : null
}

export async function startTimerSession(data: CreateTimerSessionData) {
    validateId(data.projectId)

    if (data.taskId !== undefined && data.taskId !== null) {
        validateId(data.taskId)
    }

    const activeSession = await getActiveTimerSession()

    if (activeSession) {
        throw new Error(
            'Já existe uma sessão do Timer em andamento ou pausada.'
        )
    }

    const project = await Project.findByPk(data.projectId)

    if (!project) {
        throw new Error('Projeto não encontrado ou excluído.')
    }

    if (project.status !== 'active') {
        throw new Error('Não é possível iniciar o Timer em um projeto inativo.')
    }

    if (data.taskId !== undefined && data.taskId !== null) {
        const task = await Task.findByPk(data.taskId)

        if (!task) {
            throw new Error('Tarefa não encontrada ou excluída.')
        }

        if (task.projectId !== data.projectId) {
            throw new Error(
                'A tarefa selecionada não pertence ao projeto informado.'
            )
        }
    }

    const session = await TimerSession.create({
        projectId: data.projectId,
        taskId: data.taskId ?? null,
        phase: 'focus',
        status: 'running',
        focusDurationSeconds: FOCUS_DURATION_SECONDS,
        breakDurationSeconds: BREAK_DURATION_SECONDS,
        remainingSeconds: FOCUS_DURATION_SECONDS,
        workedSeconds: 0,
        startedAt: new Date(),
        endedAt: null
    })

    return session.toJSON()
}

function validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Identificador inválido.')
    }
}

export async function pauseTimerSession() {
    const session = await TimerSession.findOne({
        where: { status: 'running' },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        throw new Error('Não existe uma sessão em andamento.')
    }

    await session.update({
        status: 'paused'
    })

    return session.toJSON()
}

export async function resumeTimerSession() {
    const session = await TimerSession.findOne({
        where: { status: 'paused' },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        throw new Error('Não existe uma sessão pausada.')
    }

    await session.update({
        status: 'running'
    })

    return session.toJSON()
}

export async function finishTimerSession() {
    const session = await TimerSession.findOne({
        where: {
            status: ['running', 'paused']
        },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        throw new Error('Não existe uma sessão ativa para finalizar.')
    }

    await session.update({
        status: 'completed',
        endedAt: new Date()
    })

    return session.toJSON()
}

export async function cancelTimerSession() {
    const session = await TimerSession.findOne({
        where: {
            status: ['running', 'paused']
        },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        throw new Error('Não existe uma sessão ativa para cancelar.')
    }

    await session.update({
        status: 'cancelled',
        endedAt: new Date()
    })

    return { success: true }
}