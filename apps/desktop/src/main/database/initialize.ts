import { database } from './connection.js'
import { registerModels } from './models.js'
import {
    initializeMigrationsTable,
    runMigrations
} from './migrations/runner.js'

export async function initializeDatabase(): Promise<void> {
    try {
        registerModels()

        await database.authenticate()
        await database.query('PRAGMA busy_timeout = 5000')
        console.info('[Database] Conexão estabelecida com sucesso.')

        await initializeMigrationsTable()
        await runMigrations()

        console.info('[Database] Migrations concluídas com sucesso.')
    } catch (error) {
        console.error(
            '[Database] Falha durante a inicialização do banco:',
            error
        )

        throw error
    }
}
