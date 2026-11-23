import type { Migration } from './types.js'
import { initialProjectsMigration } from './projects/202611231108-initial-projects.js'
import { addProjectDeletedAtMigration } from './projects/202611231204-add-project-deleted-at.js'
import { addProjectTypeMigration } from './projects/202611231340-add-project-type.js'
import { initialTasksMigration } from './tasks/202611231420-initial-tasks.js'

export const migrations: Migration[] = [
    initialProjectsMigration,
    addProjectDeletedAtMigration,
    addProjectTypeMigration,
    initialTasksMigration
]