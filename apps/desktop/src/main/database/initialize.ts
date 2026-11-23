import { database } from './connection.js'
import './models.js'

export async function initializeDatabase(): Promise<void> {
    await database.authenticate()
    console.info('[Database] Conexão estabelecida com sucesso.')

    await database.sync()
    console.info('[Database] Modelos sincronizados com sucesso.')
}