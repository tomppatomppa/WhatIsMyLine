import { tokenIsExpired } from 'src/utils/helpers'
import axios from 'axios'
import { getCookie } from './helpers'

export const httpClient = axios.create({
  withCredentials: true,
})

httpClient.interceptors.request.use((config) => {
  config.headers['X-CSRF-TOKEN'] = getCookie('csrf_access_token')

  const userExists = localStorage.getItem('user')
  if (userExists) {
    const { state } = JSON.parse(userExists)
    const { access_token, expiry } = state.user

    if (tokenIsExpired(expiry)) {
      console.log('Refresh token')
    }
    config.headers['Authorization'] = `Bearer ${access_token}`
  }

  return config
})
