import { useState } from 'react'

import AppLayout from './AppLayout'
import Dashboard from '../modules/dashboard/Dashboard'
import Projects from '../modules/projects/Projects' 

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard')

  const pageDescriptions: Record<string, string> = {
    Dashboard: 'Acompanhe seus projetos e atividades.',
    Projetos: 'Gerencie e acompanhe seus projetos.',
    Planejamento: 'Organize suas metas e atividades.',
    Sessões: 'Acompanhe seu tempo de trabalho.',
    Biblioteca: 'Organize seus materiais e referências.',
    Relatórios: 'Analise seu desempenho e progresso.'
  }

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      <div className="page-heading">
        <div>
          <h1>{currentPage}</h1>
          <p>
            {pageDescriptions[currentPage] ??
              'Organize seu workspace.'}
          </p>
        </div>
      </div>

      {currentPage === 'Dashboard' && <Dashboard />}

      {currentPage === 'Projetos' && <Projects />}
    </AppLayout>
  )
}

export default App
