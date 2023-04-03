import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

import useCurrentScripts from './hooks/useCurrentScripts'

import ReaderPage from './pages/ReaderPage'

function App() {
  const { currentScripts } = useCurrentScripts()

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={currentScripts.length}
              redirectPath="/"
            />
          }
        >
          <Route path="/reader" element={<ReaderPage />} />
        </Route>
      </Routes>
    </div>
  )
}

const ProtectedRoute = ({ isAllowed, redirectPath = '/', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}

export default App
