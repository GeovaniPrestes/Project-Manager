
import { useState } from 'react'

import AppLayout from './AppLayout'
import Dashboard from '../modules/dashboard/Dashboard'
import Projects from '../modules/projects/Projects'

import {
  APP_PAGES,
  PAGE_DESCRIPTIONS,
  type AppPage
} from './Navigation'

import type { ComponentType } from 'react'

const PAGE_COMPONENTS: Partial<Record<AppPage, ComponentType>> = {
  [APP_PAGES.DASHBOARD]: Dashboard,
  [APP_PAGES.PROJECTS]: Projects
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(
    APP_PAGES.DASHBOARD
  )

  const CurrentPage = PAGE_COMPONENTS[currentPage]

  return (
    <AppLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      <div className="page-heading">
        <div>
          <h1>{currentPage}</h1>
          <p>{PAGE_DESCRIPTIONS[currentPage]}</p>
        </div>
      </div>

      {CurrentPage ? (
        <CurrentPage />
      ) : (
        <div className="empty-state">
          Esta seção será implementada em uma próxima etapa.
        </div>
      )}
    </AppLayout>
  )
}

export default App
