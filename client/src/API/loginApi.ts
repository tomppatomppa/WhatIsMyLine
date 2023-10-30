import axios from 'axios'

import { httpClient } from 'src/utils/axiosClient'
import { BASE_URI } from 'src/config'
import { getCookie } from 'src/utils/helpers'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(`${BASE_URI}/login`, { code })
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
