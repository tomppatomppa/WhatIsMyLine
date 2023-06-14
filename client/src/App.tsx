import ReaderPage from './pages/ReaderPage'
import {
  CredentialResponse,
  GoogleLogin,
  googleLogout,
} from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import Navbar from './components/Navbar'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState<any | null>(null)

  const onSuccess = (response: CredentialResponse) => {
    if (!response.credential) return
    const decoded_jwt = jwt_decode(response.credential)

    setUser(decoded_jwt)
  }
  const handleLogout = () => {
    setUser(null)
  }
  const onError = (response: void | undefined) => {
    console.log(response)
  }

  return (
    <div className="text-center ">
      <div>{user?.name}</div>
      {user ? (
        <button onClick={handleLogout}>logout</button>
      ) : (
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
      )}

      <Navbar />
      <ReaderPage />
    </div>
  )
}

export default App
