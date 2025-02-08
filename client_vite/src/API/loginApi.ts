import axios from 'axios'
import { BASE_URI } from '../config'
import { httpClient } from '../utils/axiosClient'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(`${BASE_URI}/login`, { code }, { withCredentials: true})

  return data
}

export const refreshToken = async () => {
  const { data } = await httpClient.post(`${BASE_URI}/refresh-token`, null)
  return data
}