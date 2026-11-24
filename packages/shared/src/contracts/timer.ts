import type {
    CreateTimerSessionData,
    TimerSessionData
} from '../types/timer.js'

export interface TimerApi {
    getActive: () => Promise<TimerSessionData | null>

    start: (data: CreateTimerSessionData) => Promise<TimerSessionData>

    pause: () => Promise<TimerSessionData>

    resume: () => Promise<TimerSessionData>

    finish: () => Promise<TimerSessionData>

    cancel: () => Promise<{ success: boolean }>

    onUpdate: (
        callback: (session: TimerSessionData) => void
    ) => () => void
}
