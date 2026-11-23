interface ProjectCardProps {
    name: string
    category: string
    weeklyGoal: number
    color: string
    status: 'active' | 'paused' | 'completed'
    onEdit: () => void
    onDelete: () => void
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
    onDelete
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
                        <span className={`project-card-status ${status}`}>
                            {statusLabels[status]}
                        </span>

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
