import { DataTypes, QueryTypes } from 'sequelize'
import { database } from '../connection.js'
import { migrations } from './index.js'

const MIGRATIONS_TABLE = 'schema_migrations'

export async function initializeMigrationsTable(): Promise<void> {
    const queryInterface = database.getQueryInterface()

    const tableExists = await queryInterface.tableExists(
        MIGRATIONS_TABLE
    )

    if (tableExists) {
        return
    }

    await queryInterface.createTable(MIGRATIONS_TABLE, {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        executedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    })

    console.info('[Database] Tabela de migrations inicializada.')
}

export async function runMigrations(): Promise<void> {
    const queryInterface = database.getQueryInterface()

    const executedMigrations = await database.query<{ name: string }>(
        `SELECT name FROM ${MIGRATIONS_TABLE}`,
        { type: QueryTypes.SELECT }
    )

    const executedNames = new Set(
        executedMigrations.map(migration => migration.name)
    )

    for (const migration of migrations) {
        if (executedNames.has(migration.name)) {
            continue
        }

        console.info(`[Database] Executando migration: ${migration.name}`)

        await database.transaction(async transaction => {
            await migration.up(queryInterface, transaction)

            await queryInterface.bulkInsert(
                MIGRATIONS_TABLE,
                [{
                    name: migration.name,
                    executedAt: new Date()
                }],
                { transaction }
            )
        })

        console.info(`[Database] Migration concluída: ${migration.name}`)
    }
}