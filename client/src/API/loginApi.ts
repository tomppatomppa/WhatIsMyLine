import axios from 'axios'
import { BASE_URI } from 'src/config'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(`${BASE_URI}/login`, { code })
  return data
}
