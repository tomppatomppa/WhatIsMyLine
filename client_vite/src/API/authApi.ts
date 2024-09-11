import axios from "axios"
import { BASE_URI } from "../config"
import { getCookie } from "../utils/helpers"

export const getAuth = async () => {
    const { data } = await axios.get(`${BASE_URI}/auth`)
    return data
  }