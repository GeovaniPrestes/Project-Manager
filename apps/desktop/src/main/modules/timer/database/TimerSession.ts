import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional
} from 'sequelize'

import { database } from '../../../database/connection.js'

class TimerSession extends Model<
    InferAttributes<TimerSession>,
    InferCreationAttributes<TimerSession>
> {
    declare id: CreationOptional<number>
    declare projectId: number
    declare taskId: number | null
    declare phase: 'focus' | 'break'
    declare status: 'running' | 'paused' | 'completed' | 'cancelled'
    declare focusDurationSeconds: number
    declare breakDurationSeconds: number
    declare remainingSeconds: number
    declare workedSeconds: number
    declare startedAt: Date
    declare endedAt: CreationOptional<Date | null>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

TimerSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
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
    {
        sequelize: database,
        tableName: 'timer_sessions',
        timestamps: true
    }
)

export default TimerSession
