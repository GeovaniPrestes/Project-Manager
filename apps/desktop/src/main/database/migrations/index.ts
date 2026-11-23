import type { Migration } from './types.js'
import { initialProjectsMigration } from './202611231108-initial-projects.js'

export const migrations: Migration[] = [
    initialProjectsMigration
]