import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const createTaskChecklistItemsMigration: Migration = {
    name: '202611240100-create-task-checklist-items',

    async up(queryInterface) {
        await queryInterface.createTable('task_checklist_items', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },

            taskId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'tasks',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            title: {
                type: DataTypes.STRING,
                allowNull: false
            },

            completed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        })
    },

    async down(queryInterface) {
        await queryInterface.dropTable('task_checklist_items')
    }
}
