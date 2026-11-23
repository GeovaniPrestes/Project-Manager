import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const initialProjectsMigration: Migration = {
    name: '202611231108-initial-projects',

    up: async (queryInterface, transaction) => {
        const tableExists = await queryInterface.tableExists('projects')

        if (tableExists) {
            const columns = await queryInterface.describeTable('projects')

            const requiredColumns = [
                'id',
                'name',
                'description',
                'category',
                'color',
                'weeklyGoal',
                'status',
                'createdAt',
                'updatedAt'
            ]

            const missingColumns = requiredColumns.filter(
                column => !(column in columns)
            )

            if (missingColumns.length > 0) {
                throw new Error(
                    `[Migration] Estrutura incompatível na tabela projects. Colunas ausentes: ${missingColumns.join(', ')}`
                )
            }

            console.info(
                '[Migration] Estrutura de projects validada. Dados preservados.'
            )

            return
        }

        await queryInterface.createTable(
            'projects',
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
                },
                category: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    defaultValue: null
                },
                color: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: '#6489ed'
                },
                weeklyGoal: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                    defaultValue: 0
                },
                status: {
                    type: DataTypes.ENUM(
                        'active',
                        'paused',
                        'completed'
                    ),
                    allowNull: false,
                    defaultValue: 'active'
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            },
            { transaction }
        )
    }
}
