import { Script } from 'src/components/ReaderV3/reader.types'
import { BASE_URI } from 'src/config'
import { httpClient } from 'src/utils/axiosClient'

export const fetchAllUserScripts = async () => {
  const { data } = await httpClient.get(`${BASE_URI}/script`)

  return data
}

export const addScript = async (script: Script) => {
  const { data } = await httpClient.post(`${BASE_URI}/script`, {
    ...script,
  })

  return data
}

export const updateScript = async (script: Script) => {
  const { data } = await httpClient.put(
    `${BASE_URI}/script/${script.script_id}`,
    {
      ...script,
    }
  )

  return data
}
export const deleteScriptById = async (id: string) => {
  const { data } = await httpClient.delete(`${BASE_URI}/script/${id}`)

  return data
}
