import { database } from './connection.js'
import { registerModels } from './models.js'
import {
    initializeMigrationsTable,
    runMigrations
} from './migrations/runner.js'

export async function initializeDatabase(): Promise<void> {
    registerModels()

    await database.authenticate()
    console.info('[Database] Conexão estabelecida com sucesso.')

    await initializeMigrationsTable()
    await runMigrations()

    console.info('[Database] Migrations concluídas com sucesso.')
}