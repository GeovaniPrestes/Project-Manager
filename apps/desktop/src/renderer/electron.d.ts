import type { ProjectApi } from '@project-manager/shared'

export { }

declare global {
    interface Window {
        appInfo: {
            platform: string
        }

        projectApi: ProjectApi
    }
}
