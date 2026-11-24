import { DataTypes } from 'sequelize'
import type { Migration } from '../types.js'

export const createTimerSessionsMigration: Migration = {
    name: '202611232235-create-timer-sessions',

    up: async (queryInterface, transaction) => {
        const tableExists = await queryInterface.tableExists('timer_sessions')

        if (tableExists) {
            console.info(
                '[Migration] Tabela timer_sessions já existe. Nenhuma alteração necessária.'
            )
            return
        }

        await queryInterface.createTable(
            'timer_sessions',
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
                taskId: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: {
                        model: 'tasks',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL'
                },
                phase: {
                    type: DataTypes.ENUM('focus', 'break'),
                    allowNull: false,
                    defaultValue: 'focus'
                },
                status: {
                    type: DataTypes.ENUM(
                        'running',
                        'paused',
                        'completed',
                        'cancelled'
                    ),
                    allowNull: false,
                    defaultValue: 'running'
                },
                focusDurationSeconds: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 3000
                },
                breakDurationSeconds: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 600
                },
                remainingSeconds: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 3000
                },
                workedSeconds: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0
                },
                startedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                endedAt: {
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

        console.info('[Migration] Tabela timer_sessions criada com sucesso.')
    },

    down: async (queryInterface, transaction) => {
        await queryInterface.dropTable('timer_sessions', { transaction })
    }
}
