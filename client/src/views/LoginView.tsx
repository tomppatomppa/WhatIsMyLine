import { useGoogleLogin } from '@react-oauth/google'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { googleLogin } from 'src/API/loginApi'
import { useLogin } from 'src/store/userStore'

const LoginView = () => {
  const navigate = useNavigate()
  const loginToApp = useLogin()

  const { mutate } = useMutation(googleLogin, {
    onSuccess: (user) => {
      loginToApp(user)
      navigate('/')
    },
  })

  const loginGoogle = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: (credentials) => {
      mutate(credentials.code)
    },
  })

  return (
    <div>
      <button onClick={() => loginGoogle()}>Login Google</button>
    </div>
  )
}

export default LoginView
