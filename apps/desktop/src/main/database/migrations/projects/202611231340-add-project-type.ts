import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const addProjectTypeMigration: Migration = {
    name: '202611231340-add-project-type',

    up: async (queryInterface, transaction) => {
        const columns = await queryInterface.describeTable('projects')

        if ('type' in columns) {
            console.info(
                '[Migration] Coluna type já existe. Nenhuma alteração necessária.'
            )
            return
        }

        await queryInterface.addColumn(
            'projects',
            'type',
            {
                type: DataTypes.ENUM('personal', 'commission'),
                allowNull: false,
                defaultValue: 'personal'
            },
            { transaction }
        )
    }
}
