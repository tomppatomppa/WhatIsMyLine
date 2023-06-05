import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

import useCurrentScripts from './hooks/useCurrentScripts'

import ReaderPage from './pages/ReaderPage'
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

function App() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const { currentScripts, setCurrentScripts } = useCurrentScripts()

  const defaultScript = currentScripts.length ? currentScripts[0] : []

  const getScripts = () => {
    const foundScripts = JSON.parse(localStorage.getItem('scripts'))

    if (foundScripts) {
      setCurrentScripts(foundScripts)
      navigate('/reader')
    }
  }

  useEffect(() => {
    getScripts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App ">
      <Navbar selected={selected} setSelected={setSelected} />
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
          <Route
            path="/reader"
            element={<ReaderPage selected={defaultScript} />}
          />
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
