import type { Migration } from './types.js'
import { initialProjectsMigration } from './202611231108-initial-projects.js'
import { addProjectDeletedAtMigration } from './202611231204-add-project-deleted-at.js'
import { addProjectTypeMigration } from './202611231340-add-project-type.js'

export const migrations: Migration[] = [
    initialProjectsMigration,
    addProjectDeletedAtMigration,
    addProjectTypeMigration
]