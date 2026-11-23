
import { app } from 'electron'
import { Sequelize } from 'sequelize'
import { join } from 'node:path'

export const databasePath = join(
    app.getPath('userData'),
    'project-manager.sqlite'
)

export const database = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath,
    logging: false,
    pool: {
        max: 1,
        min: 0,
        idle: 10000
    },
    retry: {
        max: 3
    },
    dialectOptions: {
        busyTimeout: 5000
    }
})
