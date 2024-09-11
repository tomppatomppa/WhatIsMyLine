import { createBrowserRouter, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

import LandingView from "../../views/LandingView";
import { useEffect } from "react";
import ReaderView from "../../views/ReaderView";
import { useAuth } from "../../store/userStore";
import React from "react";

const MainLayout = React.lazy(() => import("../../layout/MainLayout"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/script/:id",
        element: <ReaderView />,
      },
    ],
  },
  { path: "/landing", element: <LandingView /> },
  {
    path: "/login",
    element: (
      <CatchUserIsLoggedIn>
        <LandingView />
      </CatchUserIsLoggedIn>
    ),
  },
  { path: "*", element: <CatchAllRoute /> },
]);

function CatchAllRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to '/' when the component mounts (catch-all route)
    navigate("/");
  }, [navigate]);

  return null;
}

interface CatchUserIsLoggedInProps {
  children: JSX.Element;
}
function CatchUserIsLoggedIn({ children }: CatchUserIsLoggedInProps) {
  const navigate = useNavigate();
  const loggedIn = useAuth();

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn, navigate]);

  return children;
}
