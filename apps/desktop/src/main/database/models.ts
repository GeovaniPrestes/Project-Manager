import Project from '../modules/projects/database/Project.js'
import Task from '../modules/tasks/database/Task.js'
import ChecklistItem from '../modules/tasks/database/ChecklistItem.js'

export function registerModels(): void {
    Project.hasMany(Task, {
        foreignKey: 'projectId',
        as: 'tasks'
    })

    Task.belongsTo(Project, {
        foreignKey: 'projectId',
        as: 'project'
    })

    Task.hasMany(ChecklistItem, {
        foreignKey: 'taskId',
        as: 'checklistItems'
    })

    ChecklistItem.belongsTo(Task, {
        foreignKey: 'taskId',
        as: 'task'
    })
}

export {
    Project,
    Task,
    ChecklistItem
}
