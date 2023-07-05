import axios from 'axios'
import { BASE_URI } from 'src/config'

export const googleLogin = async (code: string) => {
  const { data } = await axios.post(
    `${BASE_URI}/login`,
    { code },
    {
      withCredentials: true,
    }
  )
  console.log(data)

  return data
}

export const logout = async () => {
  const { data } = await axios.post(
    `${BASE_URI}/logout`,
    {},
    {
      withCredentials: true,
    }
  )
  return data
}

export async function makeRequestWithJWT() {
  const { data } = await axios.post(
    `${BASE_URI}/user`,
    {},
    {
      withCredentials: true,
      headers: {
        'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      },
    }
  )
  return data
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`) as any
  if (parts.length === 2) return parts.pop().split(';').shift()
}
