interface ProjectCardProps {
    name: string
    category: string
    weeklyGoal: number
    color: string
    status: 'active' | 'paused' | 'completed'
}

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
    status
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

                    <span className={`project-card-status ${status}`}>
                        {statusLabels[status]}
                    </span>
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
