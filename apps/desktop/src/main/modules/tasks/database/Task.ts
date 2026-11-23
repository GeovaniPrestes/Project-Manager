import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional
} from 'sequelize'

import type {
    TaskPriority,
    TaskStatus
} from '@project-manager/shared'

import { database } from '../../../database/connection.js'

class Task extends Model<
    InferAttributes<Task>,
    InferCreationAttributes<Task>
> {
    declare id: CreationOptional<number>
    declare projectId: number
    declare title: string
    declare description: CreationOptional<string | null>
    declare priority: CreationOptional<TaskPriority>
    declare status: CreationOptional<TaskStatus>
    declare dueDate: CreationOptional<Date | null>
    declare completedAt: CreationOptional<Date | null>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
    {
        sequelize: database,
        tableName: 'tasks',
        timestamps: true
    }
)

export default Task
