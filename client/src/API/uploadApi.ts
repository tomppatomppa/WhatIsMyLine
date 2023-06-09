import axios from 'axios'
import { BASE_URI } from 'src/config'

export const uploadfile = async (file: FormData) => {
  const { data } = await axios.post(`${BASE_URI}/api/v3/upload`, file)
  return data
}
