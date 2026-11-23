import { useEffect, useState } from 'react'
import { FolderKanban, Plus, X } from 'lucide-react'

import ProjectForm from '../components/projects/ProjectForm'
import ProjectCard from '../components/projects/ProjectCard'
import '../styles/projects.css'

type Project = Awaited<ReturnType<typeof window.projectApi.getAll>>[number]
type ProjectFilter = 'all' | 'active' | 'paused' | 'completed'

function Projects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<ProjectFilter>('all')

    const filteredProjects = projects.filter(project => {
        if (filter === 'all') {
            return true
        }

        return project.status === filter
    })

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
                <div className="projects-filters">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>

                    <button
                        className={filter === 'active' ? 'active' : ''}
                        onClick={() => setFilter('active')}
                    >
                        Em andamento
                    </button>

                    <button
                        className={filter === 'paused' ? 'active' : ''}
                        onClick={() => setFilter('paused')}
                    >
                        Pausados
                    </button>

                    <button
                        className={filter === 'completed' ? 'active' : ''}
                        onClick={() => setFilter('completed')}
                    >
                        Concluídos
                    </button>
                </div>
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
            ) : filteredProjects.length > 0 ? (
                <div className="project-cards-grid">
                    {filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            name={project.name}
                            category={project.category ?? 'Sem categoria'}
                            weeklyGoal={project.weeklyGoal}
                            color={project.color}
                            status={project.status}
                        />
                    ))}
                </div>
            ) : (
                <div className="projects-empty-state">
                    <div className="projects-empty-icon">
                        <FolderKanban size={32} />
                    </div>

                    <h2>
                        {projects.length === 0
                            ? 'Nenhum projeto cadastrado'
                            : 'Nenhum projeto encontrado'}
                    </h2>

                    <p>
                        {projects.length === 0
                            ? 'Crie seu primeiro projeto para começar a organizar suas atividades.'
                            : 'Não existem projetos com o status selecionado.'}
                    </p>

                    {projects.length === 0 && (
                        <button
                            type="button"
                            className="projects-create-button"
                            onClick={() => setShowForm(true)}
                        >
                            <Plus size={18} />
                            <span>Criar primeiro projeto</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default Projects
