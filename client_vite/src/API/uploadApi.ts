import axios from 'axios'
import { BASE_URI } from '../config'
import { getCookie } from '../utils/helpers'

export const uploadfile = async (file: FormData) => {
  const { data } = await axios.post(`${BASE_URI}/v3/upload`, file, {
    withCredentials: true,
    headers: {
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
  })
  return data
}
