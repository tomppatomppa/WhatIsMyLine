import { Navigate } from 'react-router-dom'
import { useAuth } from 'src/store/userStore'

interface ProtectedRouteProps {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const loggedIn = useAuth()

  if (!loggedIn) {
    return <Navigate to="/landing" replace />
  }

  return children
}
