import { httpClient } from 'src/utils/axiosClient'

import { BASE_URI } from 'src/config'
import axios from 'axios'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(`${BASE_URI}/login`, { code })
  return data
}

export const refreshToken = async () => {
  const { data } = await httpClient.post(`${BASE_URI}/refresh-token`, null)
  return data
}

export const logout = async () => {
  const { data } = await axios.post(`${BASE_URI}/logout`, null)
  return data
}
