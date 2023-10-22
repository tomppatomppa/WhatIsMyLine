import { createBrowserRouter, useNavigate } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginView from 'src/views/LoginView'
import LandingView from '../views/LandingView'
import { useEffect } from 'react'
import { useAuth } from 'src/store/userStore'
import ReaderView from '../views/ReaderView'

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
        element: <ReaderView />,
      },
    ],
  },
  { path: '/landing', element: <LandingView /> },
  {
    path: '/login',
    element: (
      <CatchUserIsLoggedIn>
        <LoginView />
      </CatchUserIsLoggedIn>
    ),
  },
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

interface CatchUserIsLoggedInProps {
  children: JSX.Element
}
function CatchUserIsLoggedIn({ children }: CatchUserIsLoggedInProps) {
  const navigate = useNavigate()
  const loggedIn = useAuth()

  useEffect(() => {
    if (loggedIn) navigate('/')
  }, [loggedIn, navigate])

  return children
}
