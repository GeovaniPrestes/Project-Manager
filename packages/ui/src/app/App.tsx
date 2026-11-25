import { useEffect, useRef, useState } from 'react'

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
  const [currentPage, setCurrentPage] = useState<AppPage>(APP_PAGES.DASHBOARD)
  const [showTimerRecovery, setShowTimerRecovery] = useState(false)
  const [timerAlert, setTimerAlert] = useState<
    'focus-ended' | 'break-ended' | null
  >(null)

  const previousTimerPhase = useRef<'focus' | 'break' | null>(null)

  useEffect(() => {
    const unsubscribe = window.timerApi.onUpdate(session => {
      if (session.status !== 'running') {
        previousTimerPhase.current = session.phase
        return
      }

      const previousPhase = previousTimerPhase.current

      if (previousPhase && previousPhase !== session.phase) {
        setTimerAlert(
          session.phase === 'break'
            ? 'focus-ended'
            : 'break-ended'
        )
      }

      previousTimerPhase.current = session.phase
    })

    return unsubscribe
  }, [])

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
      {timerAlert && (
        <div className="timer-alert-overlay">
          <div
            className={`timer-alert-dialog ${timerAlert}`}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="timer-alert-title"
          >
            <div className="timer-alert-icon">
              {timerAlert === 'focus-ended' ? '☕' : '⏱️'}
            </div>

            <h2 id="timer-alert-title">
              {timerAlert === 'focus-ended'
                ? 'Hora de descansar!'
                : 'Hora de voltar ao foco!'}
            </h2>

            <p>
              {timerAlert === 'focus-ended'
                ? 'Seu ciclo de foco de 50 minutos terminou. Aproveite os 10 minutos de descanso.'
                : 'Seu período de descanso terminou. Vamos começar mais um ciclo de foco?'}
            </p>

            <button
              type="button"
              onClick={() => setTimerAlert(null)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
