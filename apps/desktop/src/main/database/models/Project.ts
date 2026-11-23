import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional
} from 'sequelize'

import { database } from '../index.js'

class Project extends Model<
    InferAttributes<Project>,
    InferCreationAttributes<Project>
> {
    declare id: CreationOptional<number>
    declare name: string
    declare description: CreationOptional<string | null>
    declare category: CreationOptional<string | null>
    declare color: CreationOptional<string>
    declare weeklyGoal: CreationOptional<number>
    declare status: CreationOptional<'active' | 'paused' | 'completed'>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

Project.init(
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
            type: DataTypes.ENUM('active', 'paused', 'completed'),
            allowNull: false,
            defaultValue: 'active'
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    {
        sequelize: database,
        tableName: 'projects',
        timestamps: true
    }
)

export default Project
