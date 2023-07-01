import { useState } from 'react'
import {
  PickerConfiguration,
  authResult,
} from 'react-google-drive-picker/dist/typeDefs'
import { API_KEY, CLIENT_ID } from 'src/config'

declare let google: any

export const defaultConfiguration: PickerConfiguration = {
  clientId: CLIENT_ID as string,
  developerKey: API_KEY as string,
  viewId: 'DOCS',
  callbackFunction: () => null,
}
export const useGoogleAccessToken = () => {
  const defaultScopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
  ]

  const [authRes, setAuthRes] = useState<authResult>()
  const [config] = useState<PickerConfiguration>(defaultConfiguration)

  const getAccessToken = () => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: config.clientId,

      scope: (config.customScopes
        ? [...defaultScopes, ...config.customScopes]
        : defaultScopes
      ).join(' '),
      callback: (tokenResponse: authResult) => {
        setAuthRes(tokenResponse)
      },
    })

    client.requestAccessToken()
  }

  return { getAccessToken, authRes }
}
