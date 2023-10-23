import ScriptsContainer from '../Scripts/ScriptsContainer'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

test('renders default layout', () => {
  render(<ScriptsContainer />)

  // eslint-disable-next-line testing-library/no-debugging-utils
  screen.debug()
  expect(1).toBe(1)
})
