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

export function findChangedScripts(
  oldArray: Script[],
  newArray: Script[]
): string[] {
  const changedScripts = []

  for (let i = 0; i < oldArray.length; i++) {
    const oldScript = oldArray[i]
    const newScript = newArray.find(
      (script) => script.script_id === oldScript.script_id
    )

    if (newScript) {
      if (!isEqual(oldScript, newScript)) {
        changedScripts.push(newScript.script_id)
      }
    }
  }

  return changedScripts
}

function isEqual(objA: any, objB: any) {
  return JSON.stringify(objA) === JSON.stringify(objB)
}

export function isCurrentUserScripts(remote: Script[], local: Script[]) {
  if (remote.length !== local.length) return false

  return remote.every((remoteScript) => {
    const localScript = local.find(
      (script) => script.script_id === remoteScript.script_id
    )

    if (!localScript) {
      return false // Corresponding local script not found
    }

    return true
  })
}

interface CustomHTMLAudioElement extends HTMLAudioElement {
  key: string
}
export function createAudioElementsFromFiles(
  files: { id: any; filename: any; content: any }[]
): CustomHTMLAudioElement[] {
  return files.map((file) => {
    const fileName = file.filename
    const bytes = Uint8Array.from(atob(file.content), (c) => c.charCodeAt(0))

    const fileUrl = URL.createObjectURL(
      new Blob([bytes], { type: 'audio/mpeg' })
    )
    const audio = new Audio(fileUrl) as CustomHTMLAudioElement
    audio.key = fileName.replace('.mp3', '')
    return audio
  })
}
