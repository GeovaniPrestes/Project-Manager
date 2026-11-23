import type {
    ProjectApi,
    TaskApi
} from '@project-manager/shared'

export { }

declare global {
    interface Window {
        appInfo: {
            platform: string
        }

        projectApi: ProjectApi
        taskApi: TaskApi
    }
}
