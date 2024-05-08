import axios from 'axios'
import { BASE_URI } from '../config'
import { httpClient } from '../utils/axiosClient'
import { getCookie } from '../utils/helpers'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(`${BASE_URI}/login`, { code }, { withCredentials: true})

  return data
}

export const refreshToken = async () => {
  const { data } = await httpClient.post(`${BASE_URI}/refresh-token`, null)
  return data
}

export const getUser = async () => {
  const { data } = await axios.get(`${BASE_URI}/user`, {
    withCredentials: true,
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
  })
  return data
}

export const logout = async () => {
  const { data } = await axios.post(`${BASE_URI}/logout`, null)
  return data
}
