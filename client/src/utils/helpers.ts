export function tokenIsExpired(date: string) {
  const currentDate = Date.now()
  const compareDate = new Date(date).getTime()
  return compareDate < currentDate
}

export function removeCookie(cookieName: string) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
