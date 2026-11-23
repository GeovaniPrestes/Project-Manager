
import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const addProjectDeletedAtMigration: Migration = {
    name: '202611231204-add-project-deleted-at',

    up: async (queryInterface, transaction) => {
        const tableExists = await queryInterface.tableExists('projects')

        if (!tableExists) {
            throw new Error(
                '[Migration] A tabela projects não existe.'
            )
        }

        const columns = await queryInterface.describeTable('projects')

        if ('deletedAt' in columns) {
            console.info(
                '[Migration] Coluna deletedAt já existe. Nenhuma alteração necessária.'
            )
            return
        }

        await queryInterface.addColumn(
            'projects',
            'deletedAt',
            {
                type: DataTypes.DATE,
                allowNull: true
            },
            { transaction }
        )
    }
}
