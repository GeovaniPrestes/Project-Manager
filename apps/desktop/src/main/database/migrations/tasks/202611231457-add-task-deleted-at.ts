import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const addTaskDeletedAtMigration: Migration = {
    name: '202611231457-add-task-deleted-at',

    up: async (queryInterface, transaction) => {
        const columns = await queryInterface.describeTable('tasks')

        if ('deletedAt' in columns) {
            console.info(
                '[Migration] Coluna deletedAt já existe. Nenhuma alteração necessária.'
            )
            return
        }

        await queryInterface.addColumn(
            'tasks',
            'deletedAt',
            {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            },
            { transaction }
        )

        console.info(
            '[Migration] Coluna deletedAt adicionada à tabela tasks.'
        )
    }
}
