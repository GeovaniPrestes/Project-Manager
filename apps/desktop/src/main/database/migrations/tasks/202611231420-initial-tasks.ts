import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const initialTasksMigration: Migration = {
    name: '202611231420-initial-tasks',

    up: async (queryInterface, transaction) => {
        const tableExists = await queryInterface.tableExists('tasks')

        if (tableExists) {
            console.info(
                '[Migration] Tabela tasks já existe. Nenhuma alteração necessária.'
            )
            return
        }

        await queryInterface.createTable(
            'tasks',
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false
                },
                projectId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'projects',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'RESTRICT'
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    defaultValue: null
                },
                priority: {
                    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
                    allowNull: false,
                    defaultValue: 'medium'
                },
                status: {
                    type: DataTypes.ENUM(
                        'pending',
                        'in_progress',
                        'in_review',
                        'reopened',
                        'completed',
                        'cancelled'
                    ),
                    allowNull: false,
                    defaultValue: 'pending'
                },
                dueDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null
                },
                completedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: null
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

        console.info('[Migration] Tabela tasks criada com sucesso.')
    }
}
