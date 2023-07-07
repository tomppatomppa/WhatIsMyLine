import { createBrowserRouter } from 'react-router-dom'
import ReaderPage from '../containers/ReaderPage'
import MainLayout from './MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginView from 'src/views/LoginView'
import LandingView from '../views/LandingView'

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
])
