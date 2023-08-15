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
