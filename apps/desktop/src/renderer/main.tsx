import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../../../../packages/ui/src/App'
import '../../../../packages/ui/src/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
