import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { User, useLogin, useLogout, useUserStore } from 'src/store/userStore'

const GoogleLoginButton = () => {
  const navigate = useNavigate()
  const { user } = useUserStore((state) => state)
  const logout = useLogout()
  const login = useLogin()

  const onSuccess = (response: CredentialResponse) => {
    if (!response.credential) return
    const decoded_jwt = jwt_decode(response.credential)

    login(decoded_jwt as User)
    navigate('/', { replace: true })
  }

  const onError = (response: void | undefined) => {
    console.log(response)
  }

  return !user ? (
    <GoogleLogin onSuccess={onSuccess} onError={onError} />
  ) : (
    <button className="border p-2 rounded-md" onClick={() => logout()}>
      logout
    </button>
  )
}

export default GoogleLoginButton
