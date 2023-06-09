import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ReaderPage from './pages/ReaderPage'

import Navbar from './components/Navbar'

function App() {

  return (
    <div className="text-center ">
      <Navbar />
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
