import { app } from 'electron'
import { Sequelize } from 'sequelize'
import { join } from 'node:path'

export function createDatabase(): Sequelize {
    const databasePath = join(
        app.getPath('userData'),
        'project-manager.sqlite'
    )

    return new Sequelize({
        dialect: 'sqlite',
        storage: databasePath,
        logging: false
    })
}
