import { app } from 'electron'
import { Sequelize } from 'sequelize'
import { join } from 'node:path'

const databasePath = join(
    app.getPath('userData'),
    'project-manager.sqlite'
)

export const database = new Sequelize({
    dialect: 'sqlite',
    storage: databasePath,
    logging: false
})
