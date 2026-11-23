import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AppLayout>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Acompanhe seus projetos e atividades.</p>
        </div>
      </div>

      <Dashboard />
    </AppLayout>
  )
}

export default App