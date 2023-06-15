import { createBrowserRouter } from 'react-router-dom'
import ReaderPage from '../containers/ReaderPage'
import LandingPage from './LandingPage'
import MainLayout from './MainLayout'
import { ProtectedRoute } from './ProtectedRoute'

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
  { path: '/landing', element: <LandingPage /> },
])
