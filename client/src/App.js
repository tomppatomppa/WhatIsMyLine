import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

import useCurrentScripts from './hooks/useCurrentScripts'

import ReaderPage from './pages/ReaderPage'
import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'
import {  useScriptStore, useSetCurrentScript, useSetScripts } from './store/scriptStore'

function App() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const { currentScripts, setCurrentScripts } = useCurrentScripts()
  const setScripts = useSetScripts()
  const defaultScript = currentScripts.length ? currentScripts[0] : []
  const store = useScriptStore()

  const getScripts = () => {
    const foundScripts = JSON.parse(localStorage.getItem('scripts'))
   
    if (foundScripts) {
      setScripts(foundScripts)
      store.setActiveScript(0)
      setCurrentScripts(foundScripts)
      navigate('/reader')
    }
  }

  useEffect(() => {
    getScripts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div className="text-center ">
    
      <Navbar selected={selected} setSelected={setSelected} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={store.activeScript !== null}
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
