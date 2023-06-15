import { Navigate } from 'react-router-dom'
import { useAuth } from 'src/store/userStore'

export const ProtectedRoute = ({ children }: any) => {
  const user = useAuth()

  if (!user) {
    return <Navigate to="/landing" replace />
  }
  return children
}
