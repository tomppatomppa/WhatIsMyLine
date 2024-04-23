import axios from 'axios'
import { BASE_URI } from '../config'

export const uploadfile = async (file: FormData) => {
  const { data } = await axios.post(`${BASE_URI}/v3/upload`, file)
  return data
}
