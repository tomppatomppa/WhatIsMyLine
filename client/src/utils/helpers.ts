import { Script } from 'src/components/ReaderV3/reader.types'

export function tokenIsExpired(date: number) {
  const currentDate = Date.now()
  const unixTime = Math.floor(currentDate / 1000)

  return date < unixTime
}

export function removeCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`) as any
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export async function showUserPrompt() {
  return new Promise((resolve) => {
    const userChoice = window.confirm(
      'Do you want to load the script from the local file?'
    )

    if (userChoice) {
      resolve('local')
    } else {
      resolve('database')
    }
  })
}

export function identifyScriptsToUpdate(
  remoteData: Script[],
  localScripts: Script[]
): {
  scriptsToUpdateInDatabase: Script[]
  scriptsToAddToLocalState: Script[]
} {
  const remoteScriptIds = remoteData.map((script) => script.script_id)
  const localScriptIds = localScripts.map((script) => script.script_id)

  const scriptsToUpdateInDatabase = localScripts.filter((script) =>
    remoteScriptIds.includes(script.script_id)
  )

  const scriptsToAddToLocalState = remoteData.filter(
    (script) => !localScriptIds.includes(script.script_id)
  )

  return {
    scriptsToUpdateInDatabase,
    scriptsToAddToLocalState,
  }
}

export function getSceneNumber(string: string, delimiter = ' '): number {
  const value = string.split(delimiter)[0]
  return Number(value)
}
