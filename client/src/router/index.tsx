import { createBrowserRouter, useNavigate } from 'react-router-dom'
import ReaderPage from '../containers/ReaderPage'
import MainLayout from './MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginView from 'src/views/LoginView'
import LandingView from '../views/LandingView'
import { useEffect } from 'react'

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
  { path: '/landing', element: <LandingView /> },
  { path: '/login', element: <LoginView /> },
  { path: '*', element: <CatchAllRoute /> },
])

function CatchAllRoute() {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to '/' when the component mounts (catch-all route)
    navigate('/')
  }, [navigate])

  return null
}
