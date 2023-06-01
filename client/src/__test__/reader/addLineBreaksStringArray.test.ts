import { addLineBreaksStringArray } from 'src/components/ReaderV3/utils'

describe('addLineBreaksStringArray.test', () => {
  test('Should add \n to each item in array', () => {
    const stringArray = ['hello', 'world']
    expect(addLineBreaksStringArray(stringArray)).toEqual([
      'hello\n',
      'world\n',
    ])
  })
})
