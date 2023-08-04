import { tokenIsExpired } from 'src/utils/helpers'
import axios from 'axios'
import { getCookie } from './helpers'
import { BASE_URI } from 'src/config'
import { User } from 'src/store/userStore'

export const httpClient = axios.create({
  withCredentials: true,
})

httpClient.interceptors.request.use(async (config) => {
  config.headers['X-CSRF-TOKEN'] = getCookie('csrf_access_token')

  const userExists = localStorage.getItem('user')
  if (userExists) {
    const { state } = JSON.parse(userExists)
    let { access_token, expiry } = state.user

    if (tokenIsExpired(expiry)) {
      const { data } = await axios.post(
        `${BASE_URI}/refresh-token`,
        null,
        config
      )
      updateUserAccessTokenAndExpiry(state.user, data.access_token, data.expiry)
      access_token = data.access_token
    }
    config.headers['Authorization'] = `Bearer ${access_token}`
  }

  return config
})

async function updateUserAccessTokenAndExpiry(
  user: User,
  access_token: string,
  expiry: string
) {
  localStorage.setItem(
    'user',
    JSON.stringify({
      state: {
        user: {
          ...user,
          access_token,
          expiry,
        },
      },
    })
  )
}
