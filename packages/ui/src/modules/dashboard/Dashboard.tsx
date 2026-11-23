import { useEffect, useState } from 'react'

import {
    CalendarClock,
    Clock,
    FolderKanban,
    TrendingUp
} from 'lucide-react'

import StatCard from './components/StatCard'
import ProjectProgress from './components/ProjectProgress'
import '../../styles/dashboard.css'

type Project = Awaited<ReturnType<typeof window.projectApi.getAll>>[number]

function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProjects() {
            try {
                const result = await window.projectApi.getAll()
                setProjects(result)
            } catch (error) {
                console.error('Erro ao carregar projetos:', error)
            } finally {
                setLoading(false)
            }
        }

        void loadProjects()
    }, [])

    const activeProjects = projects.filter(
        project => project.status === 'active'
    )

    const plannedHours = projects.reduce(
        (total, project) => total + project.weeklyGoal,
        0
    )

    return (
        <div className="dashboard">
            <section className="dashboard-stats">
                <StatCard
                    title="Horas planejadas"
                    value={`${plannedHours}h`}
                    description="Meta semanal"
                    icon={CalendarClock}
                />

                <StatCard
                    title="Horas registradas"
                    value="0h"
                    description="Tempo registrado nesta semana"
                    icon={Clock}
                />

                <StatCard
                    title="Projetos"
                    value={String(projects.length)}
                    description="Projetos no planejamento"
                    icon={FolderKanban}
                />

                <StatCard
                    title="Progresso semanal"
                    value="0%"
                    description="Execução da meta semanal"
                    icon={TrendingUp}
                />
            </section>

            <section className="dashboard-projects">
                <div className="dashboard-section-header">
                    <h2>Projetos em andamento</h2>
                    <span>Visão geral do progresso</span>
                </div>

                <div className="project-progress-list">
                    {loading ? (
                        <p>Carregando projetos...</p>
                    ) : activeProjects.length > 0 ? (
                        activeProjects.map(project => (
                            <ProjectProgress
                                key={project.id}
                                name={project.name}
                                category={project.category ?? 'Sem categoria'}
                                hours={`${project.weeklyGoal}h / semana`}
                                progress={0}
                                color={project.color}
                            />
                        ))
                    ) : (
                        <p>Nenhum projeto em andamento.</p>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Dashboard
