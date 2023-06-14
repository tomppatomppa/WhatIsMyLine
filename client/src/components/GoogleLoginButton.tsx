import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { User, useLogin, useLogout, useUserStore } from 'src/store/userStore'

const GoogleLoginButton = () => {
  const { user } = useUserStore((state) => state)
  const logout = useLogout()
  const login = useLogin()

  const onSuccess = (response: CredentialResponse) => {
    if (!response.credential) return

    const decoded_jwt = jwt_decode(response.credential)

    login(decoded_jwt as User)
  }

  const onError = (response: void | undefined) => {
    console.log(response)
  }

  return !user ? (
    <GoogleLogin onSuccess={onSuccess} onError={onError} />
  ) : (
    <button onClick={() => logout()}>logout</button>
  )
}

export default GoogleLoginButton
