import { createBrowserRouter, useNavigate } from 'react-router-dom'
import ReaderPage from '../containers/ReaderPage'
import MainLayout from '../layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginView from 'src/views/LoginView'
import LandingView from '../views/LandingView'
import { useEffect } from 'react'
import { useAuth } from 'src/store/userStore'

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
