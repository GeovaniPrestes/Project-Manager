import { Pencil, Trash2 } from 'lucide-react'

interface ProjectCardProps {
    name: string
    category: string
    weeklyGoal: number
    color: string
    status: 'active' | 'paused' | 'completed'
    entityLabel?: 'projeto' | 'comissão'
    onEdit: () => void
    onDelete: () => void
    onStatusChange: (status: 'active' | 'paused' | 'completed') => void
}

function ProjectCard({
    name,
    category,
    weeklyGoal,
    color,
    status,
    entityLabel = 'projeto',
    onEdit,
    onDelete,
    onStatusChange
}: ProjectCardProps) {
    const formattedGoal = Number.isInteger(weeklyGoal)
        ? weeklyGoal.toString()
        : weeklyGoal.toLocaleString('pt-BR')

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
                            title={`Editar ${entityLabel}`}
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            type="button"
                            className="project-card-delete"
                            onClick={onDelete}
                            aria-label={`Excluir ${name}`}
                            title={`Excluir ${entityLabel}`}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="project-card-footer">
                    <span>Meta semanal</span>
                    <strong>
                        {weeklyGoal > 0 ? `${formattedGoal}h` : 'Sem meta'}
                    </strong>
                </div>
            </div>
        </article>
    )
}

export default ProjectCard
