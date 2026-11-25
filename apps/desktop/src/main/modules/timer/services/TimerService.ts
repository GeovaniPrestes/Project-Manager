import TimerSession from '../database/TimerSession.js'
import Project from '../../projects/database/Project.js'
import Task from '../../tasks/database/Task.js'

import {
    TIMER_IPC_CHANNELS
} from '@project-manager/shared'

import { getMainWindow } from '../../../core/window.js'

import type {
    CreateTimerSessionData
} from '@project-manager/shared'

let timerInterval: ReturnType<typeof setInterval> | null = null
let isTicking = false
let tickPromise: Promise<void> | null = null

const FOCUS_DURATION_SECONDS = 50 * 60
const BREAK_DURATION_SECONDS = 10 * 60

function validateCommissionStartTime(): void {
    const now = new Date()

    const day = now.getDay()
    const minutes = now.getHours() * 60 + now.getMinutes()

    const isWeekday = day >= 1 && day <= 5
    const isWithinWorkingHours =
        minutes >= 8 * 60 && minutes < 18 * 60

    if (!isWeekday || !isWithinWorkingHours) {
        throw new Error(
            'Projetos de comissão só podem iniciar de segunda a sexta-feira, das 08:00 às 18:00.'
        )
    }
}

function notifyTimerUpdate(session: TimerSession): void {
    const window = getMainWindow()

    if (!window || window.isDestroyed()) {
        return
    }

    window.webContents.send(
        TIMER_IPC_CHANNELS.UPDATE,
        session.toJSON()
    )
}

export async function pauseTimerOnShutdown(): Promise<void> {
    await stopTimerAndWaitForTick()

    const session = await TimerSession.findOne({
        where: { status: 'running' },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        return
    }

    await session.update({
        status: 'paused'
    })

    notifyTimerUpdate(session)

    console.info('[Timer] Sessão pausada durante o encerramento.')
}

export async function recoverInterruptedTimerSession(): Promise<void> {
    const session = await TimerSession.findOne({
        where: { status: 'running' },
        order: [['createdAt', 'DESC']]
    })

    if (!session) {
        return
    }

    await session.update({
        status: 'paused'
    })

    console.info(
        '[Timer] Sessão interrompida recuperada e pausada.',
        { sessionId: session.id }
    )
}

async function tickTimer(): Promise<void> {
    if (isTicking) {
        return
    }

    isTicking = true

    try {
        const session = await TimerSession.findOne({
            where: { status: 'running' },
            order: [['createdAt', 'DESC']]
        })

        if (!session) {
            stopTimerInterval()
            return
        }

        const remainingSeconds = Math.max(
            session.remainingSeconds - 1,
            0
        )

        const workedSeconds =
            session.workedSeconds +
            (session.phase === 'focus' ? 1 : 0)

        let phase = session.phase
        let nextRemainingSeconds = remainingSeconds

        if (remainingSeconds === 0) {
            if (session.phase === 'focus') {
                phase = 'break'
                nextRemainingSeconds = session.breakDurationSeconds
            } else {
                phase = 'focus'
                nextRemainingSeconds = session.focusDurationSeconds
            }
        }

        await session.update({
            phase,
            remainingSeconds: nextRemainingSeconds,
            workedSeconds
        })

        notifyTimerUpdate(session)
    } catch (error) {
        console.error('[Timer] Erro na contagem regressiva:', error)
    } finally {
        isTicking = false
    }
}

function startTimerInterval(): void {
    if (timerInterval) {
        return
    }

    timerInterval = setInterval(() => {
        if (tickPromise) {
            return
        }

        tickPromise = tickTimer().finally(() => {
            tickPromise = null
        })
    }, 1000)
}

function stopTimerInterval(): void {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
}

async function stopTimerAndWaitForTick(): Promise<void> {
    stopTimerInterval()

    if (tickPromise) {
        await tickPromise
    }
}

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

    if (project.type === 'commission') {
        validateCommissionStartTime()
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

    notifyTimerUpdate(session)
    startTimerInterval()

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

    await stopTimerAndWaitForTick()

    await session.update({
        status: 'paused'
    })

    notifyTimerUpdate(session)

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

    notifyTimerUpdate(session)
    startTimerInterval()

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

    await stopTimerAndWaitForTick()

    await session.update({
        status: 'completed',
        endedAt: new Date()
    })


    notifyTimerUpdate(session)

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

    await stopTimerAndWaitForTick()

    await session.update({
        status: 'cancelled',
        endedAt: new Date()
    })

    return { success: true }
}

