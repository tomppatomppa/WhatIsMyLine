import { tokenIsExpired } from 'src/utils/helpers'

describe('tokenIsExpired', () => {
  test('Should return true when date is less than current date', () => {
    const dateString = 1691040792 //Date and time (GMT): Thursday, August 3, 2023 5:33:12 AM

    expect(tokenIsExpired(dateString)).toBe(true)
  })

  test('Should return false when date is more than current date', () => {
    const dateString = 4120954392

    expect(tokenIsExpired(dateString)).toBe(false)
  })
})
test('Should return true when date is less than current date', () => {
  const dateString = 1691040792 //Date and time (GMT): Thursday, August 3, 2023 5:33:12 AM

  expect(tokenIsExpired(dateString)).toBe(true)
})
