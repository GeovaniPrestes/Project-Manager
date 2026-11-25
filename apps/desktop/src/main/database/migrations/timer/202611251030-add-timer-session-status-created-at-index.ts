import type { Migration } from '../types.js'

export const addTimerSessionStatusCreatedAtIndexMigration: Migration = {
    name: '202611251030-add-timer-session-status-created-at-index',

    up: async (queryInterface, transaction) => {
        await queryInterface.addIndex(
            'timer_sessions',
            ['status', 'createdAt'],
            {
                name: 'timer_sessions_status_created_at_idx',
                transaction
            }
        )

        console.info(
            '[Migration] Índice de status e data da sessão criado com sucesso.'
        )
    },

    down: async (queryInterface, transaction) => {
        await queryInterface.removeIndex(
            'timer_sessions',
            'timer_sessions_status_created_at_idx',
            { transaction }
        )
    }
}