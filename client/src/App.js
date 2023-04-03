import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

import useCurrentScripts from './hooks/useCurrentScripts'
import { useEffect } from 'react'

import axios from 'axios'
import { BASE_URI } from './config'
import ReaderPage from './pages/ReaderPage'

function App() {
  const navigate = useNavigate()
  const { currentScripts, setCurrentScripts } = useCurrentScripts()

  // useEffect(() => {
  //   const get_data = async () => {
  //     const { data } = await axios.get(`${BASE_URI}/api/v3`)
  //     console.log(data)
  //     setCurrentScripts([data])
  //     navigate('/reader')
  //   }
  //   get_data()
  // }, [])

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
