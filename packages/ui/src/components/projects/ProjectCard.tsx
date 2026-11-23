interface ProjectCardProps {
    name: string
    category: string
    weeklyGoal: number
    color: string
    status: 'active' | 'paused' | 'completed'
    onEdit: () => void
    onDelete: () => void
    onStatusChange: (status: 'active' | 'paused' | 'completed') => void
}

import { Pencil, Trash2 } from 'lucide-react'

const statusLabels = {
    active: 'Em andamento',
    paused: 'Pausado',
    completed: 'Concluído'
}

function ProjectCard({
    name,
    category,
    weeklyGoal,
    color,
    status,
    onEdit,
    onDelete,
    onStatusChange
}: ProjectCardProps) {
    return (
        <article className="project-card">
            <div
                className="project-card-color"
                style={{ backgroundColor: color }}
            />

            <div className="project-card-content">
                <div className="project-card-header">
                    <div>
                        <h3>{name}</h3>
                        <span>{category}</span>
                    </div>

                    <div className="project-card-actions">
                        <select
                            className={`project-card-status-select ${status}`}
                            value={status}
                            onChange={event =>
                                onStatusChange(
                                    event.target.value as 'active' | 'paused' | 'completed'
                                )
                            }
                            aria-label={`Status de ${name}`}
                        >
                            <option value="active">Em andamento</option>
                            <option value="paused">Pausado</option>
                            <option value="completed">Concluído</option>
                        </select>

                        <button
                            type="button"
                            className="project-card-edit"
                            onClick={onEdit}
                            aria-label={`Editar ${name}`}
                            title="Editar projeto"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            type="button"
                            className="project-card-delete"
                            onClick={onDelete}
                            aria-label={`Excluir ${name}`}
                            title="Excluir projeto"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="project-card-footer">
                    <span>Meta semanal</span>
                    <strong>{weeklyGoal}h</strong>
                </div>
            </div>
        </article>
    )
}

export default ProjectCard
