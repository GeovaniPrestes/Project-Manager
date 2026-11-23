
import Project from '../modules/projects/database/Project.js'
import Task from '../modules/tasks/database/Task.js'

export function registerModels(): void {
    Project.hasMany(Task, {
        foreignKey: 'projectId',
        as: 'tasks'
    })

    Task.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project'
    })
}

export {
    Project,
    Task
}
