import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppHookContainer } from './AppHookContainer.tsx'
import './i18n/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHookContainer />
  </StrictMode>,
)
