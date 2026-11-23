import { registerProjectsIpc } from '../../modules/projects/ipc/projects.ipc.js'

export function registerIpcHandlers(): void {
    registerProjectsIpc()
}