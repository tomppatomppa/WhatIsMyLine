import axios from "axios"
import { BASE_URI } from "../config"
import { getCookie } from "../utils/helpers"

export const getAuth = async () => {
    const { data } = await axios.get(`${BASE_URI}/auth`, {
      withCredentials: true,
      headers: {
        'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      },
    })
    return data
  }