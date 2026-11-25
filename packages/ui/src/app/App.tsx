import { useEffect, useState } from 'react'

import AppLayout from './AppLayout'
import Dashboard from '../modules/dashboard/Dashboard'
import Projects from '../modules/projects/Projects'
import Commissions from '../modules/commissions/Commissions'
import Tasks from '../modules/tasks/Tasks'
import TimerRecoveryDialog from '../modules/timer/TimerRecoveryDialog'
import Timer from '../modules/timer/Timer'

import {
    APP_PAGES,
    PAGE_DESCRIPTIONS,
    type AppPage
} from './Navigation'

import type { ComponentType } from 'react'

const PAGE_COMPONENTS: Partial<Record<AppPage, ComponentType>> = {
    [APP_PAGES.DASHBOARD]: Dashboard,
    [APP_PAGES.PROJECTS]: Projects,
    [APP_PAGES.COMMISSIONS]: Commissions,
    [APP_PAGES.TASKS]: Tasks,
    [APP_PAGES.TIMER]: Timer
}

function App() {
    const [currentPage, setCurrentPage] = useState<AppPage>(
        APP_PAGES.DASHBOARD
    )

    const [showTimerRecovery, setShowTimerRecovery] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function checkTimerSession() {
            try {
                const session = await window.timerApi.getActive()

                if (!cancelled && session?.status === 'paused') {
                    setShowTimerRecovery(true)
                }
            } catch (error) {
                console.error(
                    '[Timer] Erro ao verificar sessão anterior:',
                    error
                )
            }
        }

        void checkTimerSession()

        return () => {
            cancelled = true
        }
    }, [])

    async function restoreTimerSession(): Promise<void> {
        await window.timerApi.resume()
        setShowTimerRecovery(false)
    }

    async function discardTimerSession(): Promise<void> {
        await window.timerApi.cancel()
        setShowTimerRecovery(false)
    }

    const CurrentPage = PAGE_COMPONENTS[currentPage]

    return (
        <>
            <AppLayout
                currentPage={currentPage}
                onNavigate={setCurrentPage}
            >
                <div className="page-heading">
                    <div>
                        <h1>{currentPage}</h1>
                        <p>{PAGE_DESCRIPTIONS[currentPage]}</p>
                    </div>
                </div>

                {CurrentPage ? (
                    <CurrentPage />
                ) : (
                    <div className="empty-state">
                        Esta seção será implementada em uma próxima etapa.
                    </div>
                )}
            </AppLayout>

            {showTimerRecovery && (
                <TimerRecoveryDialog
                    onRestore={restoreTimerSession}
                    onDiscard={discardTimerSession}
                />
            )}
        </>
    )
}

export default App
