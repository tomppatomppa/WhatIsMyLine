import axios from 'axios'
import { getCookie } from './helpers'

export const httpClient = axios.create({
  withCredentials: true,
})

httpClient.interceptors.request.use((config) => {
  config.headers['X-CSRF-TOKEN'] = getCookie('csrf_access_token')

  return config
})
