import axios from 'axios'
import { getCookie } from 'src/API/loginApi'

const httpClient = axios.create({
  withCredentials: true,
})

httpClient.interceptors.request.use((config) => {
  //   const accessToken = localStorage.getItem(
  //     process.env.REACT_APP_AUTH_TOKEN_NAME!
  //   )
  config.withCredentials = true
  config.headers['X-CSRF-TOKEN'] = getCookie('csrf_access_token')
  // config.headers['Authorization'] = `Bearer ${accessToken}`

  return config
})

export { httpClient }
