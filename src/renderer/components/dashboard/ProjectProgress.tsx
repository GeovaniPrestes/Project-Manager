interface ProjectProgressProps {
  name: string
  category: string
  hours: string
  progress: number
  color: string
}

function ProjectProgress({
  name,
  category,
  hours,
  progress,
  color
}: ProjectProgressProps) {
  return (
    <article className="project-progress">
      <div className="project-progress-info">
        <div>
          <strong>{name}</strong>
          <span>{category}</span>
        </div>

        <span className="project-progress-hours">{hours}</span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            backgroundColor: color
          }}
        />
      </div>

      <span className="progress-percentage">{progress}% concluído</span>
    </article>
  )
}

export default ProjectProgress
