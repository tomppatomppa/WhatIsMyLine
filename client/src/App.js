import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import useCurrentScripts from './hooks/useCurrentScripts'
import { useEffect } from 'react'
import { parseHTML } from './components/ReaderV2/ReaderSection'
import axios from 'axios'
import { BASE_URI } from './config'
import ReaderPage from './pages/ReaderPage'

function App() {
  const navigate = useNavigate()
  const { currentScripts, setCurrentScripts } = useCurrentScripts()

  const loadScripts = () => {
    const scripts = JSON.parse(localStorage.getItem('scripts'))

    if (scripts) {
      const scriptItems = scripts.map((script) => {
        return parseHTML(script)
      })
      setCurrentScripts(scriptItems)
      navigate('/home')
    }
  }

  useEffect(() => {
    loadScripts()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const get_data = async () => {
      const { data } = await axios.get(`${BASE_URI}/api/v3`)
      console.log(data)
      setCurrentScripts([data])
      navigate('/reader')
    }
    get_data()
  }, [])
  return (
    <div className="App">
      <Routes>
        <Route path="/reader" element={<ReaderPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          element={
            <ProtectedRoute
              isAllowed={currentScripts.length}
              redirectPath="/"
            />
          }
        >
          <Route path="/home" element={<Home />} />
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
