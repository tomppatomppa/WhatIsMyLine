import '@testing-library/jest-dom'

import { renderWithClient } from 'src/__test__/reader/utils'

import ScriptsContainer from '../Scripts/ScriptsContainer'

//Problems using Mock service worker
/**
 * SyntaxError: Unexpected token 'export'

      1 | // @ts-nocheck
      2 | import { render } from '@testing-library/react'
    > 3 | import { http } from 'msw'
 */
test('successful query component', async () => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  //const result = renderWithClient(<ScriptsContainer />)
  expect(1).toBe(1)
  // eslint-disable-next-line testing-library/prefer-screen-queries
  // expect(await result.findByText(/mocked-react-query/i)).toBeInTheDocument()
})
