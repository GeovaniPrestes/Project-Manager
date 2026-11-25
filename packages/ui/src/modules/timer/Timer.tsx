import { useEffect, useState } from 'react'
import {
    Play,
    Pause,
    Square,
    Timer as TimerIcon,
    Coffee
} from 'lucide-react'

import '../../app/styles/timer.css'

type Project = Awaited<
    ReturnType<typeof window.projectApi.getAll>
>[number]

type Task = Awaited<
    ReturnType<typeof window.taskApi.getAll>
>[number]

type TimerSession = Awaited<
    ReturnType<typeof window.timerApi.getActive>
>

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function formatWorkedTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h ${String(minutes).padStart(2, '0')}min`
}

function Timer() {
    const [projects, setProjects] = useState<Project[]>([])
    const [tasks, setTasks] = useState<Task[]>([])

    const [selectedProjectId, setSelectedProjectId] = useState('')
    const [selectedTaskId, setSelectedTaskId] = useState('')

    const [session, setSession] = useState<TimerSession>(null)
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = window.timerApi.onUpdate(updatedSession => {
            setSession(
                updatedSession.status === 'running' ||
                updatedSession.status === 'paused'
                    ? updatedSession
                    : null
            )
        })

        async function initialize() {
            try {
                const [projectList, activeSession] = await Promise.all([
                    window.projectApi.getAll(),
                    window.timerApi.getActive()
                ])

                setProjects(
                    projectList.filter(project => project.status === 'active')
                )

                if (activeSession) {
                    setSession(activeSession)
                    setSelectedProjectId(String(activeSession.projectId))

                    if (activeSession.taskId !== null) {
                        setSelectedTaskId(String(activeSession.taskId))
                    }
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Erro ao carregar o Timer.'
                )
            } finally {
                setLoading(false)
            }
        }

        void initialize()

        return unsubscribe
    }, [])

    useEffect(() => {
        if (!selectedProjectId) {
            setTasks([])
            setSelectedTaskId('')
            return
        }

        async function loadTasks() {
            try {
                const result = await window.taskApi.getAll(
                    Number(selectedProjectId)
                )

                setTasks(
                    result.filter(task =>
                        task.status !== 'completed' &&
                        task.status !== 'cancelled'
                    )
                )
            } catch (err) {
                console.error('[Timer] Erro ao carregar tarefas:', err)
            }
        }

        void loadTasks()
    }, [selectedProjectId])

    async function executeAction(action: () => Promise<unknown>) {
        setProcessing(true)
        setError(null)

        try {
            await action()
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível executar a operação.'
            )
        } finally {
            setProcessing(false)
        }
    }

    async function handleStart() {
        if (!selectedProjectId) {
            setError('Selecione um projeto para iniciar o Timer.')
            return
        }

        await executeAction(() =>
            window.timerApi.start({
                projectId: Number(selectedProjectId),
                taskId: selectedTaskId
                    ? Number(selectedTaskId)
                    : null
            })
        )
    }

    async function handlePause() {
        await executeAction(() => window.timerApi.pause())
    }

    async function handleResume() {
        await executeAction(() => window.timerApi.resume())
    }

    async function handleFinish() {
        await executeAction(() => window.timerApi.finish())
    }

    const isRunning = session?.status === 'running'
    const isBreak = session?.phase === 'break'

    const selectedProject = projects.find(
        project => project.id === session?.projectId
    )

    if (loading) {
        return <div className="timer-page">Carregando Timer...</div>
    }

    return (
        <div className="timer-page">
            <div className="timer-toolbar">
                <div>
                    <h2>Controle de tempo</h2>
                    <p>Organize seus ciclos de foco e descanso.</p>
                </div>
            </div>

            <div className="timer-main-card">
                <div className={`timer-phase ${isBreak ? 'break' : 'focus'}`}>
                    {isBreak ? (
                        <Coffee size={20} />
                    ) : (
                        <TimerIcon size={20} />
                    )}

                    <span>
                        {isBreak ? 'Período de descanso' : 'Período de foco'}
                    </span>
                </div>

                <div className="timer-countdown">
                    {formatTime(
                        session?.remainingSeconds ?? 50 * 60
                    )}
                </div>

                <p className="timer-cycle-description">
                    {isBreak
                        ? 'Aproveite para descansar.'
                        : 'Concentre-se na sua atividade.'}
                </p>

                {session && (
                    <div className="timer-progress">
                        <div
                            className={`timer-progress-bar ${isBreak ? 'break' : 'focus'}`}
                            style={{
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        ((session.phase === 'focus'
                                            ? session.focusDurationSeconds
                                            : session.breakDurationSeconds) -
                                            session.remainingSeconds) /
                                            (session.phase === 'focus'
                                                ? session.focusDurationSeconds
                                                : session.breakDurationSeconds) *
                                            100
                                    )
                                )}%`
                            }}
                        />
                    </div>
                )}

                <div className="timer-controls">
                    {!session ? (
                        <button
                            type="button"
                            className="timer-primary-button"
                            disabled={processing}
                            onClick={() => void handleStart()}
                        >
                            <Play size={18} />
                            Iniciar foco
                        </button>
                    ) : (
                        <>
                            {isRunning ? (
                                <button
                                    type="button"
                                    className="timer-primary-button"
                                    disabled={processing}
                                    onClick={() => void handlePause()}
                                >
                                    <Pause size={18} />
                                    Pausar
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="timer-primary-button"
                                    disabled={processing}
                                    onClick={() => void handleResume()}
                                >
                                    <Play size={18} />
                                    Retomar
                                </button>
                            )}

                            <button
                                type="button"
                                className="timer-finish-button"
                                disabled={processing}
                                onClick={() => void handleFinish()}
                            >
                                <Square size={16} />
                                Finalizar
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="timer-configuration-card">
                <h3>Atividade</h3>

                <div className="timer-form-group">
                    <label htmlFor="timer-project">Projeto</label>

                    <select
                        id="timer-project"
                        value={session
                            ? String(session.projectId)
                            : selectedProjectId}
                        disabled={Boolean(session) || processing}
                        onChange={event => {
                            setSelectedProjectId(event.target.value)
                        }}
                    >
                        <option value="">Selecione um projeto</option>

                        {projects.map(project => (
                            <option
                                key={project.id}
                                value={project.id}
                            >
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="timer-form-group">
                    <label htmlFor="timer-task">Tarefa (opcional)</label>

                    <select
                        id="timer-task"
                        value={session
                            ? String(session.taskId ?? '')
                            : selectedTaskId}
                        disabled={Boolean(session) || processing || !selectedProjectId}
                        onChange={event => {
                            setSelectedTaskId(event.target.value)
                        }}
                    >
                        <option value="">Sem tarefa específica</option>

                        {tasks.map(task => (
                            <option
                                key={task.id}
                                value={task.id}
                            >
                                {task.title}
                            </option>
                        ))}
                    </select>
                </div>

                {session && (
                    <div className="timer-active-project">
                        <span>Trabalhando em:</span>
                        <strong>
                            {selectedProject?.name ?? 'Projeto'}
                        </strong>
                    </div>
                )}
            </div>

            <div className="timer-worked-card">
                <span>Tempo efetivamente trabalhado nesta sessão</span>
                <strong>
                    {formatWorkedTime(session?.workedSeconds ?? 0)}
                </strong>
                <small>
                    Os períodos de descanso não são contabilizados.
                </small>
            </div>

            {error && (
                <div className="timer-error">
                    {error}
                </div>
            )}
        </div>
    )
}

export default Timer
