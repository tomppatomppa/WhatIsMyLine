import { BASE_URI } from 'src/config'
import { httpClient } from 'src/utils/axiosClient'

export const fetchAllUserScripts = async () => {
  const { data } = await httpClient.get(`${BASE_URI}/api/script`)

  return data
}

export const deleteScriptById = async (id: string) => {
  const { data } = await httpClient.delete(`${BASE_URI}/api/script/${id}`)

  return data
}
