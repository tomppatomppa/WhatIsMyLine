import { Route, Routes, useNavigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ReaderPage from './pages/ReaderPage'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import {  useScriptStore,  useSetScripts } from './store/scriptStore'

function App() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
 
  const setScripts = useSetScripts()
  const store = useScriptStore()

  const getScripts = () => {
    const foundScripts = JSON.parse(localStorage.getItem('scripts') as string)
   
    if (foundScripts.length > 0) {
      setScripts(foundScripts)
      store.setActiveScriptFilename(foundScripts[0].filename)
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
            path="/reader"
            element={<ReaderPage />}
          />  
      </Routes> 
    </div>
  )
}

export default App
