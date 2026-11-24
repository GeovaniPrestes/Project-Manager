import { useEffect, useState, type DragEvent } from 'react'
import {
    FolderKanban,
    BriefcaseBusiness,
    ListTodo,
    Plus,
    Pencil,
    Trash2,
    ListChecks
} from 'lucide-react'

import type {
    ProjectType,
    TaskStatus,
    TaskPriority
} from '@project-manager/shared'

import '../../app/styles/tasks.css'

type Project = Awaited<
    ReturnType<typeof window.projectApi.getAll>
>[number]

type Task = Awaited<
    ReturnType<typeof window.taskApi.getAll>
>[number]

type ChecklistItem = Awaited<
    ReturnType<typeof window.taskApi.getChecklist>
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
    const [showTaskForm, setShowTaskForm] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDescription, setTaskDescription] = useState('')
    const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium')
    const [taskDueDate, setTaskDueDate] = useState('')
    const [savingTask, setSavingTask] = useState(false)
    const [draggedTask, setDraggedTask] = useState<Task | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [deletingTask, setDeletingTask] = useState(false)
    const [checklists, setChecklists] = useState<
        Record<number, ChecklistItem[]>
    >({})
    const [expandedChecklistTask, setExpandedChecklistTask] = useState<number | null>(null)
    const [newChecklistItemTitle, setNewChecklistItemTitle] = useState('')
    const [loadingChecklist, setLoadingChecklist] = useState(false)
    const [savingChecklistItem, setSavingChecklistItem] = useState(false)

    const personalProjects = projects.filter(
        project => project.type === 'personal'
    )

    const commissions = projects.filter(
        project => project.type === 'commission'
    )

    useEffect(() => {
        let cancelled = false

        const loadProjects = async () => {
            try {
                const result = await window.projectApi.getAll()

                if (!cancelled) {
                    setProjects(result)
                }
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
            }
        }

        void loadProjects()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        async function loadTasks() {
            if (!selectedProject) {
                setTasks([])
                setChecklists({})
                setLoading(false)
                return
            }

            setLoading(true)
            setExpandedChecklistTask(null)
            setNewChecklistItemTitle('')

            try {
                const result = await window.taskApi.getAll(selectedProject.id)

                const checklistResults = await Promise.all(
                    result.map(async task => {
                        try {
                            const items = await window.taskApi.getChecklist(task.id)
                            return [task.id, items] as const
                        } catch (error) {
                            console.error(
                                `Erro ao carregar checklist da tarefa ${task.id}:`,
                                error
                            )
                            return [task.id, []] as const
                        }
                    })
                )

                if (!cancelled) {
                    setTasks(result)
                    setChecklists(Object.fromEntries(checklistResults))
                }
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error)

                if (!cancelled) {
                    setError('Não foi possível carregar as tarefas.')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        void loadTasks()

        return () => {
            cancelled = true
        }
    }, [selectedProject?.id])

    useEffect(() => {
        setExpandedChecklistTask(null)
        setNewChecklistItemTitle('')

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

    const handleToggleChecklistItem = async (item: ChecklistItem) => {
        try {
            const updatedItem = await window.taskApi.toggleChecklistItem(item.id)

            setChecklists(prev => ({
                ...prev,
                [item.taskId]: (prev[item.taskId] ?? []).map(current =>
                    current.id === item.id ? updatedItem : current
                )
            }))
        } catch (error) {
            console.error('Erro ao atualizar item do checklist:', error)
        }
    }

    const handleDeleteChecklistItem = async (item: ChecklistItem) => {
        try {
            await window.taskApi.deleteChecklistItem(item.id)

            setChecklists(prev => ({
                ...prev,
                [item.taskId]: (prev[item.taskId] ?? []).filter(
                    current => current.id !== item.id
                )
            }))
        } catch (error) {
            console.error('Erro ao excluir item do checklist:', error)
        }
    }

    const handleCreateChecklistItem = async (taskId: number) => {
        const title = newChecklistItemTitle.trim()

        if (!title || savingChecklistItem) {
            return
        }

        setSavingChecklistItem(true)

        try {
            const item = await window.taskApi.createChecklistItem({
                taskId,
                title
            })

            console.log('[Checklist Renderer] Item recebido:', item)
console.log('[Checklist Renderer] Título recebido:', item.title)

            setChecklists(prev => ({
                ...prev,
                [taskId]: [...(prev[taskId] ?? []), item]
            }))

            setNewChecklistItemTitle('')
        } catch (error) {
            console.error('Erro ao criar item do checklist:', error)
        } finally {
            setSavingChecklistItem(false)
        }
    }

    const handleToggleChecklist = async (taskId: number) => {
        if (expandedChecklistTask === taskId) {
            setExpandedChecklistTask(null)
            setNewChecklistItemTitle('')
            return
        }

        setExpandedChecklistTask(taskId)
        setNewChecklistItemTitle('')
        setLoadingChecklist(true)

        try {
            const items = await window.taskApi.getChecklist(taskId)

            setChecklists(prev => ({
                ...prev,
                [taskId]: items
            }))
        } catch (error) {
            console.error('Erro ao carregar checklist:', error)
        } finally {
            setLoadingChecklist(false)
        }
    }

    async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!selectedProject || !taskTitle.trim()) {
            return
        }

        setSavingTask(true)
        setError(null)

        const data = {
            title: taskTitle.trim(),
            description: taskDescription.trim() || null,
            priority: taskPriority,
            dueDate: taskDueDate
                ? new Date(`${taskDueDate}T12:00:00`)
                : null
        }

        try {
            if (editingTask) {
                const updatedTask = await window.taskApi.update(
                    editingTask.id,
                    data
                )

                setTasks(current =>
                    current.map(task =>
                        task.id === updatedTask.id ? updatedTask : task
                    )
                )
            } else {
                const newTask = await window.taskApi.create({
                    projectId: selectedProject.id,
                    ...data
                })

                setTasks(current => [...current, newTask])
            }

            setTaskTitle('')
            setTaskDescription('')
            setTaskPriority('medium')
            setTaskDueDate('')
            setEditingTask(null)
            setShowTaskForm(false)
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error)
            setError('Não foi possível salvar a tarefa.')
        } finally {
            setSavingTask(false)
        }
    }

    function handleDragStart(
        event: DragEvent<HTMLDivElement>,
        task: Task
    ) {
        setDraggedTask(task)

        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(task.id))
    }

    function handleDragOver(
        event: DragEvent<HTMLElement>,
        status: TaskStatus
    ) {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setDragOverColumn(status)
    }

    async function handleDrop(
        event: DragEvent<HTMLElement>,
        status: TaskStatus
    ) {
        event.preventDefault()

        const task = draggedTask

        setDragOverColumn(null)
        setDraggedTask(null)

        if (!task || task.status === status) {
            return
        }

        try {
            const updatedTask = await window.taskApi.updateStatus(
                task.id,
                status
            )

            setTasks(current =>
                current.map(item =>
                    item.id === updatedTask.id
                        ? updatedTask
                        : item
                )
            )
        } catch (error) {
            console.error('Erro ao movimentar tarefa:', error)
            setError('Não foi possível movimentar a tarefa.')
        }
    }

    function handleEditTask(task: Task) {
        setEditingTask(task)

        setTaskTitle(task.title)
        setTaskDescription(task.description ?? '')
        setTaskPriority(task.priority)

        setTaskDueDate(
            task.dueDate
                ? new Date(task.dueDate).toISOString().slice(0, 10)
                : ''
        )

        setShowTaskForm(true)
    }

    async function handleDeleteTask(task: Task) {
        const confirmed = window.confirm(
            `Deseja realmente excluir a tarefa "${task.title}"?`
        )

        if (!confirmed) {
            return
        }

        setDeletingTask(true)

        try {
            await window.taskApi.delete(task.id)

            setTasks(current =>
                current.filter(item => item.id !== task.id)
            )

            if (editingTask?.id === task.id) {
                setEditingTask(null)
                setShowTaskForm(false)
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error)
            setError('Não foi possível excluir a tarefa.')
        } finally {
            setDeletingTask(false)
        }
    }

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
                            className={`tasks-project-item ${selectedProject?.id === project.id
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

                            <button
                                type="button"
                                className="tasks-create-button"
                                onClick={() => setShowTaskForm(current => !current)}
                            >
                                <Plus size={18} />
                                Nova tarefa
                            </button>
                        </div>

                        {showTaskForm && (
                            <form
                                className="tasks-create-form"
                                onSubmit={handleCreateTask}
                            >
                                <h2>{editingTask ? 'Editar tarefa' : 'Nova tarefa'}</h2>
                                <label>
                                    Título
                                    <input
                                        type="text"
                                        value={taskTitle}
                                        onChange={event => setTaskTitle(event.target.value)}
                                        placeholder="O que precisa ser feito?"
                                        required
                                        autoFocus
                                    />
                                </label>

                                <label>
                                    Descrição
                                    <textarea
                                        value={taskDescription}
                                        onChange={event => setTaskDescription(event.target.value)}
                                        placeholder="Detalhes da tarefa (opcional)"
                                        rows={3}
                                    />
                                </label>

                                <div className="tasks-form-row">
                                    <label>
                                        Prioridade
                                        <select
                                            value={taskPriority}
                                            onChange={event =>
                                                setTaskPriority(event.target.value as TaskPriority)
                                            }
                                        >
                                            <option value="low">Baixa</option>
                                            <option value="medium">Média</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </label>

                                    <label>
                                        Prazo
                                        <input
                                            type="date"
                                            value={taskDueDate}
                                            onChange={event => setTaskDueDate(event.target.value)}
                                        />
                                    </label>
                                </div>

                                <div className="tasks-form-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTaskForm(false)
                                            setEditingTask(null)
                                            setTaskTitle('')
                                            setTaskDescription('')
                                            setTaskPriority('medium')
                                            setTaskDueDate('')
                                        }}
                                        disabled={savingTask}
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={savingTask || !taskTitle.trim()}
                                    >
                                        {savingTask
                                            ? 'Salvando...'
                                            : editingTask
                                                ? 'Salvar alterações'
                                                : 'Criar tarefa'}
                                    </button>
                                </div>
                            </form>
                        )}

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
                                            className={`tasks-kanban-column ${dragOverColumn === column.status ? 'drag-over' : ''
                                                }`}
                                            onDragOver={event => handleDragOver(event, column.status)}
                                            onDrop={event => handleDrop(event, column.status)}
                                        >
                                            <div className="tasks-kanban-column-header">
                                                <h2>{column.title}</h2>
                                                <span>{columnTasks.length}</span>
                                            </div>

                                            <div className="tasks-kanban-column-content">
                                                {columnTasks.map(task => (
                                                    <div
                                                        className={`tasks-kanban-card ${draggedTask?.id === task.id ? 'dragging' : ''
                                                            }`}
                                                        key={task.id}
                                                        draggable
                                                        onDragStart={event => handleDragStart(event, task)}
                                                        onDragEnd={() => {
                                                            setDraggedTask(null)
                                                            setDragOverColumn(null)
                                                        }}
                                                    >
                                                        <div className="tasks-kanban-card-header">
                                                            <strong className="tasks-kanban-card-title">
                                                                {task.title}
                                                            </strong>

                                                            <div className="tasks-kanban-card-actions">
                                                                <button
                                                                    type="button"
                                                                    title="Editar tarefa"
                                                                    onClick={() => handleEditTask(task)}
                                                                    onMouseDown={event => event.stopPropagation()}
                                                                >
                                                                    <Pencil size={14} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    title="Excluir tarefa"
                                                                    disabled={deletingTask}
                                                                    onClick={() => handleDeleteTask(task)}
                                                                    onMouseDown={event => event.stopPropagation()}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="tasks-kanban-card-meta">
                                                            <span className={`tasks-priority priority-${task.priority}`}>
                                                                {{
                                                                    low: 'Baixa',
                                                                    medium: 'Média',
                                                                    high: 'Alta',
                                                                    urgent: 'Urgente'
                                                                }[task.priority]}
                                                            </span>

                                                            {task.dueDate && (
                                                                <span className="tasks-due-date">
                                                                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="tasks-checklist">
                                                            <button
                                                                type="button"
                                                                className="tasks-checklist-toggle"
                                                                onClick={event => {
                                                                    event.stopPropagation()
                                                                    handleToggleChecklist(task.id)
                                                                }}
                                                                onMouseDown={event => event.stopPropagation()}
                                                            >
                                                                <ListChecks size={15} />

                                                                <span>
                                                                    Checklist
                                                                    {' '}
                                                                    ({(checklists[task.id] ?? []).filter(item => item.completed).length}
                                                                    /
                                                                    {(checklists[task.id] ?? []).length})
                                                                </span>
                                                            </button>

                                                            {expandedChecklistTask === task.id && (
                                                                <div
                                                                    className="tasks-checklist-content"
                                                                    onClick={event => event.stopPropagation()}
                                                                    onMouseDown={event => event.stopPropagation()}
                                                                >
                                                                    {loadingChecklist ? (
                                                                        <p>Carregando checklist...</p>
                                                                    ) : (
                                                                        <>
                                                                            {(checklists[task.id] ?? []).map(item => (
                                                                                <div
                                                                                    key={item.id}
                                                                                    className="tasks-checklist-item"
                                                                                >
                                                                                    <label className="tasks-checklist-item-label">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={item.completed}
                                                                                            onChange={() =>
                                                                                                handleToggleChecklistItem(item)
                                                                                            }
                                                                                        />

                                                                                        <span className={item.completed ? 'completed' : ''}>
                                                                                            {item.title || 'Item sem título'}
                                                                                        </span>
                                                                                    </label>

                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleDeleteChecklistItem(item)}
                                                                                        title="Excluir item"
                                                                                    >
                                                                                        <Trash2 size={13} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}

                                                                            <form
                                                                                className="tasks-checklist-form"
                                                                                onSubmit={event => {
                                                                                    event.preventDefault()
                                                                                    handleCreateChecklistItem(task.id)
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    value={newChecklistItemTitle}
                                                                                    onChange={event =>
                                                                                        setNewChecklistItemTitle(event.target.value)
                                                                                    }
                                                                                    placeholder="Novo item..."
                                                                                />

                                                                                <button
                                                                                    type="submit"
                                                                                    disabled={
                                                                                        !newChecklistItemTitle.trim() ||
                                                                                        savingChecklistItem
                                                                                    }
                                                                                    title="Adicionar item"
                                                                                >
                                                                                    <Plus size={15} />
                                                                                </button>
                                                                            </form>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
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
