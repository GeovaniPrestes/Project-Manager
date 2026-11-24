import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional
} from 'sequelize'

import { database } from '../../../database/connection.js'

class ChecklistItem extends Model<
    InferAttributes<ChecklistItem>,
    InferCreationAttributes<ChecklistItem>
> {
    declare id: CreationOptional<number>
    declare taskId: number
    declare title: string
    declare completed: CreationOptional<boolean>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

ChecklistItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
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
    },
    {
        sequelize: database,
        tableName: 'task_checklist_items',
        timestamps: true
    }
)

export default ChecklistItem
