import { useEffect, useState } from 'react'
import { FolderKanban, Plus, X } from 'lucide-react'

import ProjectForm from '../components/projects/ProjectForm'
import ProjectProgress from '../components/dashboard/ProjectProgress'
import '../styles/projects.css'

type Project = Awaited<ReturnType<typeof window.projectApi.getAll>>[number]

function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [showForm, setShowForm] = useState(false)
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

    async function handleCreateProject(data: {
        name: string
        description: string
        category: string
        color: string
        weeklyGoal: number
    }) {
        try {
            const project = await window.projectApi.create(data)

            setProjects(current => [...current, project])
            setShowForm(false)
        } catch (error) {
            console.error('Erro ao criar projeto:', error)
        }
    }

    return (
        <div className="projects-page">
            <div className="projects-toolbar">
                <div>
                    <span className="projects-count">
                        {projects.length} projeto(s)
                    </span>
                </div>

                <button
                    type="button"
                    className="projects-create-button"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={18} />
                    <span>Novo projeto</span>
                </button>
            </div>

            {showForm && (
                <div className="projects-empty-state">
                    <div className="projects-toolbar">
                        <h2>Novo projeto</h2>

                        <button
                            type="button"
                            className="projects-close-button"
                            onClick={() => setShowForm(false)}
                            aria-label="Fechar formulário"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <ProjectForm
                        onCancel={() => setShowForm(false)}
                        onSubmit={handleCreateProject}
                    />
                </div>
            )}

            {loading ? (
                <p>Carregando projetos...</p>
            ) : projects.length > 0 ? (
                <div className="project-progress-list">
                    {projects.map(project => (
                        <ProjectProgress
                            key={project.id}
                            name={project.name}
                            category={project.category ?? 'Sem categoria'}
                            hours={`${project.weeklyGoal}h / semana`}
                            progress={0}
                            color={project.color}
                        />
                    ))}
                </div>
            ) : !showForm ? (
                <div className="projects-empty-state">
                    <div className="projects-empty-icon">
                        <FolderKanban size={32} />
                    </div>

                    <h2>Nenhum projeto cadastrado</h2>

                    <p>
                        Crie seu primeiro projeto para começar a organizar
                        suas atividades e acompanhar seu progresso.
                    </p>

                    <button
                        type="button"
                        className="projects-create-button"
                        onClick={() => setShowForm(true)}
                    >
                        <Plus size={18} />
                        <span>Criar primeiro projeto</span>
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default Projects
