import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../../../../packages/ui/src/app/App'
import "../../../../packages/ui/src/app/styles/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
