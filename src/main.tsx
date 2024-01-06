import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Providers from './Providers.tsx'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import { router } from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
