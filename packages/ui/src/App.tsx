import { useState } from 'react'

import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'

function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard')

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      <div className="page-heading">
        <div>
          <h1>{currentPage}</h1>
          <p>
            {currentPage === 'Dashboard'
              ? 'Acompanhe seus projetos e atividades.'
              : 'Gerencie e acompanhe seus projetos.'}
          </p>
        </div>
      </div>

      {currentPage === 'Dashboard' && <Dashboard />}

      {currentPage === 'Projetos' && (
        <div>
          <p>Página de projetos em construção.</p>
        </div>
      )}
    </AppLayout>
  )
}

export default App
