import type { Migration } from './types.js'
import { initialProjectsMigration } from './202611231108-initial-projects.js'
import { addProjectDeletedAtMigration } from './202611231204-add-project-deleted-at.js'

export const migrations: Migration[] = [
    initialProjectsMigration,
    addProjectDeletedAtMigration
]