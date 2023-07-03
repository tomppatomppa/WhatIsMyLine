export function tokenIsExpired(date: string) {
  const currentDate = Date.now()
  const compareDate = new Date(date).getTime()
  return compareDate < currentDate
}
