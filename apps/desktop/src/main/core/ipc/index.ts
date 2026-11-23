import { registerProjectsIpc } from '../../modules/projects/ipc/projects.ipc.js'
import { registerTasksIpc } from '../../modules/tasks/ipc/tasks.ipc.js'

export function registerIpcHandlers(): void {
    registerProjectsIpc()
    registerTasksIpc()
}
