import type {
    ProjectApi,
    TaskApi,
    TimerApi
} from '@project-manager/shared'

export { }

declare global {
    interface Window {
        appInfo: {
            platform: string
        }

        projectApi: ProjectApi
        taskApi: TaskApi
        timerApi: TimerApi
    }
}
