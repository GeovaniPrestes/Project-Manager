export type TimerPhase = 'focus' | 'break'

export type TimerStatus =
    | 'running'
    | 'paused'
    | 'completed'
    | 'cancelled'

export interface CreateTimerSessionData {
    projectId: number
    taskId?: number | null
}

export interface TimerSessionData {
    id: number
    projectId: number
    taskId: number | null
    phase: TimerPhase
    status: TimerStatus
    focusDurationSeconds: number
    breakDurationSeconds: number
    remainingSeconds: number
    workedSeconds: number
    startedAt: Date
    endedAt: Date | null
    createdAt: Date
    updatedAt: Date
}
