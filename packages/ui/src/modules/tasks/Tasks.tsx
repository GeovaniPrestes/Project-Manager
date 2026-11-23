
import { useEffect, useState } from 'react'
import {
    FolderKanban,
    BriefcaseBusiness,
    ListTodo
} from 'lucide-react'

import type {
    ProjectType,
    TaskStatus
} from '@project-manager/shared'

import '../../app/styles/tasks.css'

type Project = Awaited<
    ReturnType<typeof window.projectApi.getAll>
>[number]

type Task = Awaited<
    ReturnType<typeof window.taskApi.getAll>
>[number]

type KanbanColumn = {
    status: TaskStatus
    title: string
}

const KANBAN_COLUMNS: KanbanColumn[] = [
    { status: 'pending', title: 'Pendente' },
    { status: 'in_progress', title: 'Em andamento' },
    { status: 'in_review', title: 'Em revisão' },
    { status: 'reopened', title: 'Reaberta' },
    { status: 'completed', title: 'Concluída' },
    { status: 'cancelled', title: 'Cancelada' }
]

function Tasks() {
    const [projects, setProjects] = useState<Project[]>([])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingTasks, setLoadingTasks] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const personalProjects = projects.filter(
        project => project.type === 'personal'
    )

    const commissions = projects.filter(
        project => project.type === 'commission'
    )

    useEffect(() => {
        async function loadProjects() {
            try {
                const result = await window.projectApi.getAll()

                const activeProjects = result.filter(
                    project => project.status === 'active'
                )

                setProjects(activeProjects)
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
                setError('Não foi possível carregar os projetos.')
            } finally {
                setLoading(false)
            }
        }

        void loadProjects()
    }, [])

    useEffect(() => {
        if (!selectedProject) {
            setTasks([])
            return
        }

        let cancelled = false

        async function loadTasks() {
            setLoadingTasks(true)
            setTasks([])

            try {
                const result = await window.taskApi.getAll(selectedProject!.id)

                if (!cancelled) {
                    setTasks(result)
                }
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error)
            } finally {
                if (!cancelled) {
                    setLoadingTasks(false)
                }
            }
        }

        void loadTasks()

        return () => {
            cancelled = true
        }
    }, [selectedProject?.id])

    function renderProjectList(
        title: string,
        type: ProjectType,
        items: Project[]
    ) {
        const Icon = type === 'personal'
            ? FolderKanban
            : BriefcaseBusiness

        return (
            <section className="tasks-sidebar-section">
                <div className="tasks-sidebar-section-header">
                    <Icon size={16} />
                    <h3>{title}</h3>
                    <span>{items.length}</span>
                </div>

                <div className="tasks-project-list">
                    {items.map(project => (
                        <button
                            key={project.id}
                            type="button"
                            className={`tasks-project-item ${
                                selectedProject?.id === project.id
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() => setSelectedProject(project)}
                        >
                            <span
                                className="tasks-project-color"
                                style={{ backgroundColor: project.color }}
                            />

                            <span className="tasks-project-name">
                                {project.name}
                            </span>
                        </button>
                    ))}

                    {items.length === 0 && (
                        <p className="tasks-sidebar-empty">
                            Nenhum item ativo.
                        </p>
                    )}
                </div>
            </section>
        )
    }

    return (
        <div className="tasks-page">
            <aside className="tasks-sidebar">
                <div className="tasks-sidebar-header">
                    <ListTodo size={20} />
                    <h2>Meus quadros</h2>
                </div>

                {loading ? (
                    <p className="tasks-sidebar-message">
                        Carregando projetos...
                    </p>
                ) : error ? (
                    <p className="tasks-sidebar-message error">
                        {error}
                    </p>
                ) : (
                    <>
                        {renderProjectList(
                            'Projetos pessoais',
                            'personal',
                            personalProjects
                        )}

                        {renderProjectList(
                            'Comissões',
                            'commission',
                            commissions
                        )}
                    </>
                )}
            </aside>

            <main className="tasks-content">
                {selectedProject ? (
                    <>
                        <div className="tasks-content-header">
                            <div>
                                <span className="tasks-content-category">
                                    {selectedProject.type === 'personal'
                                        ? 'Projeto pessoal'
                                        : 'Comissão'}
                                </span>

                                <h1>{selectedProject.name}</h1>

                                {selectedProject.description && (
                                    <p>{selectedProject.description}</p>
                                )}
                            </div>
                        </div>

                        {loadingTasks ? (
                            <p className="tasks-board-message">
                                Carregando tarefas...
                            </p>
                        ) : (
                            <div className="tasks-kanban">
                                {KANBAN_COLUMNS.map(column => {
                                    const columnTasks = tasks.filter(
                                        task => task.status === column.status
                                    )

                                    return (
                                        <section
                                            key={column.status}
                                            className="tasks-kanban-column"
                                        >
                                            <div className="tasks-kanban-column-header">
                                                <h2>{column.title}</h2>
                                                <span>{columnTasks.length}</span>
                                            </div>

                                            <div className="tasks-kanban-column-content">
                                                {columnTasks.map(task => (
                                                    <article
                                                        key={task.id}
                                                        className="tasks-kanban-card"
                                                    >
                                                        <h3>{task.title}</h3>
                                                    </article>
                                                ))}

                                                {columnTasks.length === 0 && (
                                                    <p className="tasks-kanban-empty">
                                                        Nenhuma tarefa
                                                    </p>
                                                )}
                                            </div>
                                        </section>
                                    )
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="tasks-empty-state">
                        <div className="tasks-empty-icon">
                            <FolderKanban size={32} />
                        </div>

                        <h2>Selecione um projeto</h2>

                        <p>
                            Escolha um projeto pessoal ou uma comissão
                            na lista lateral para visualizar seu quadro
                            de tarefas.
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Tasks
