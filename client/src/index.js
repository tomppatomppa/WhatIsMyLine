import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
