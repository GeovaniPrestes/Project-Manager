import { useState } from 'react'

import AppLayout from './AppLayout'
import Dashboard from '../modules/dashboard/Dashboard'
import Projects from '../modules/projects/Projects'
import {
  APP_PAGES,
  PAGE_DESCRIPTIONS,
  type AppPage
} from './Navigation'

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(
    APP_PAGES.DASHBOARD
  )

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      <div className="page-heading">
        <div>
          <h1>{currentPage}</h1>
          <p>
            {PAGE_DESCRIPTIONS[currentPage] ?? 'Organize seu workspace.'}
          </p>
        </div>
      </div>

      {currentPage === APP_PAGES.DASHBOARD && <Dashboard />}
      {currentPage === APP_PAGES.PROJECTS && <Projects />}
    </AppLayout>
  )
}

export default App
