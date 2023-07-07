import { httpClient } from 'src/utils/axiosClient'

import { BASE_URI } from 'src/config'

export const googleLogin = async (code: string) => {
  const { data } = await httpClient.post(`${BASE_URI}/login`, { code })
  return data
}

export const logout = async () => {
  const { data } = await httpClient.post(`${BASE_URI}/logout`, null)
  return data
}

export async function makeRequestWithJWT() {
  const { data } = await httpClient.post(`${BASE_URI}/user`, null)
  return data
}
