import { Navigate } from "react-router-dom";
import { useAuth } from "../../store/userStore";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const loggedIn = useAuth();
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
