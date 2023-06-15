import { createBrowserRouter } from 'react-router-dom'
import ReaderPage from '../containers/ReaderPage'
import LandingPage from './PublicLayout'
import MainLayout from './MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import PublicLayout from './PublicLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <ReaderPage />,
      },
    ],
  },
  { path: '/landing', element: <PublicLayout /> },
])
