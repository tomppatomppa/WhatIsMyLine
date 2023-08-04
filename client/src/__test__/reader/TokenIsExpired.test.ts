import { tokenIsExpired } from 'src/utils/helpers'

describe('tokenIsExpired', () => {
  test('Should return true when date is less than current date', () => {
    const dateString = '1980-07-03T11:49:15.864259Z'

    expect(tokenIsExpired(dateString)).toBe(true)
  })
  test('Should return true when date is less than current date second', () => {
    const dateString = '2023-08-03T20:58:09.554080Z'

    expect(tokenIsExpired(dateString)).toBe(true)
  })
  // test('Should return false when date is more than current date', () => {
  //   const dateString = '2100-07-03T11:49:15.864259Z'

  //   expect(tokenIsExpired(dateString)).toBe(false)
  // })
})
