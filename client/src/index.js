import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { MutationCache, QueryClient, QueryClientProvider } from 'react-query'

import { removeCookie } from './utils/helpers'

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      const { msg } = error.response.data
      if (error.response?.status === 401 && msg) {
        window.alert(msg)
        localStorage.removeItem('user')
        removeCookie('csrf_access_token')
        removeCookie('access_token_cookie')
        window.location.href = '/login'
      }
    },
  }),
})

const root = ReactDOM.createRoot(document.getElementById('root'))

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
