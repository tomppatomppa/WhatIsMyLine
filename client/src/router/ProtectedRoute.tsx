import { Navigate } from 'react-router-dom'
import { useAuth } from 'src/store/userStore'

interface ProtectedRouteProps {
  children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useAuth()

  if (!user) {
    return <Navigate to="/landing" replace />
  }
  return children
}
