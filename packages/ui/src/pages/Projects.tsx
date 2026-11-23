import { FolderKanban, Plus } from 'lucide-react'

import '../styles/projects.css'

function Projects() {
    return (
        <div className="projects-page">
            <div className="projects-toolbar">
                <div>
                    <span className="projects-count">Seus projetos</span>
                </div>

                <button
                    type="button"
                    className="projects-create-button"
                >
                    <Plus size={18} />
                    <span>Novo projeto</span>
                </button>
            </div>

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
                >
                    <Plus size={18} />
                    <span>Criar primeiro projeto</span>
                </button>
            </div>
        </div>
    )
}

export default Projects
