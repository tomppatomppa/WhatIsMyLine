export function tokenIsExpired(date: number) {
  const currentDate = Date.now()
  const unixTime = Math.floor(currentDate / 1000)
  console.log(date, unixTime)
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
