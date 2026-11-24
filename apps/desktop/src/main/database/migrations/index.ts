import type { Migration } from './types.js'
import { initialProjectsMigration } from './projects/202611231108-initial-projects.js'
import { addProjectDeletedAtMigration } from './projects/202611231204-add-project-deleted-at.js'
import { addProjectTypeMigration } from './projects/202611231340-add-project-type.js'
import { initialTasksMigration } from './tasks/202611231420-initial-tasks.js'
import { addTaskDeletedAtMigration } from './tasks/202611231457-add-task-deleted-at.js'
import { createTaskChecklistItemsMigration } from './tasks/202611240100-create-task-checklist-items.js'
import { createTimerSessionsMigration } from './timer/202611232235-create-timer-sessions.js'

export const migrations: Migration[] = [
    initialProjectsMigration,
    addProjectDeletedAtMigration,
    addProjectTypeMigration,
    initialTasksMigration,
    addTaskDeletedAtMigration,
    createTaskChecklistItemsMigration,
    createTimerSessionsMigration,
]