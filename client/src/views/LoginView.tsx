import { useGoogleLogin } from '@react-oauth/google'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { googleLogin } from 'src/API/loginApi'
import GoogleLoginButton from 'src/components/auth/GoogleLoginButton'

const LoginView = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const { mutate } = useMutation(googleLogin, {
    onSuccess: (data) => {
      console.log(data)
    },
  })
  const ogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/drive',
    onSuccess: (credentials) => {
      mutate(credentials.code)
    },
  })
  return (
    <div>
      <button onClick={() => ogin()}>Login Google</button>
    </div>
  )
}

export default LoginView
