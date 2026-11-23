import {
    CalendarClock,
    Clock,
    FolderKanban,
    TrendingUp
} from 'lucide-react'

import StatCard from '../components/dashboard/StatCard'
import ProjectProgress from '../components/dashboard/ProjectProgress'
import '../styles/dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard">
            <section className="dashboard-stats">
                <StatCard
                    title="Horas planejadas"
                    value="30h"
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
                    value="5"
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
                    <ProjectProgress
                        name="Azashi"
                        category="Desenvolvimento de jogos"
                        hours="10h / semana"
                        progress={0}
                        color="#6489ed"
                    />

                    <ProjectProgress
                        name="Refazer TCC"
                        category="Desenvolvimento acadêmico"
                        hours="7h / semana"
                        progress={0}
                        color="#45a985"
                    />

                    <ProjectProgress
                        name="Segundo jogo"
                        category="Desenvolvimento de jogos"
                        hours="5h / semana"
                        progress={0}
                        color="#b58ae8"
                    />

                    <ProjectProgress
                        name="Desenho e Pixel Art"
                        category="Prática artística"
                        hours="4h / semana"
                        progress={0}
                        color="#d69b62"
                    />

                    <ProjectProgress
                        name="Portfólio"
                        category="Desenvolvimento web"
                        hours="3h / semana"
                        progress={0}
                        color="#4ca9bd"
                    />
                </div>
            </section>
        </div>
    )
}

export default Dashboard
