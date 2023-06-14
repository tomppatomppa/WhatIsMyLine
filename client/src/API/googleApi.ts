import { CredentialResponse } from '@react-oauth/google'
import axios from 'axios'

export const getUserData = async (user: CredentialResponse) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.credential}`,
    {
      headers: {
        Authorization: `Bearer ${user.credential}`,
        Accept: 'application/json',
      },
    }
  )

  return data
}
