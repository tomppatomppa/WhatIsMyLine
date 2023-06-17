import { useNavigate } from 'react-router-dom'
import { useLogout, useSetAccessToken, useUserStore } from 'src/store/userStore'
import { useGoogleAccessToken } from './hooks/useGoogleAccessToken'
import { useEffect } from 'react'

const GoogleLoginButton = () => {
  const { getAccessToken, authRes } = useGoogleAccessToken()
  const setToken = useSetAccessToken()
  const logout = useLogout()
  const navigate = useNavigate()
  const { user } = useUserStore((state) => state)

  useEffect(() => {
    if (authRes?.access_token) {
      setToken(authRes.access_token)
      navigate('/')
    }
  }, [authRes?.access_token, navigate, setToken])

  return user ? (
    <button className="mr-2" onClick={() => logout()}>
      logout
    </button>
  ) : (
    <button onClick={getAccessToken}>Login</button>
  )
}

export default GoogleLoginButton
