import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import ScriptListItem from '../Scripts/ScriptListItem'

test('renders list item with active class', async () => {
  render(
    <ScriptListItem
      key={'1'}
      id={`script-list-item-0`}
      isActiveScript={true}
      onClick={() => {}}
    ></ScriptListItem>
  )

  const listItems = await screen.findAllByRole('listitem')

  expect(listItems[0]).toHaveClass('text-gray-900 border-indigo-600')
})
test('renders list without active class', async () => {
  render(
    <ScriptListItem
      key={'1'}
      id={`script-list-item-0`}
      isActiveScript={false}
      onClick={() => {}}
    ></ScriptListItem>
  )

  const listItems = await screen.findAllByRole('listitem')

  expect(listItems[0]).not.toHaveClass('text-gray-900 border-indigo-600')
})

test('renders child components', async () => {
  render(
    <ScriptListItem
      key={'1'}
      id={`script-list-item-0`}
      isActiveScript={false}
      onClick={() => {}}
    >
      <button>Child Component</button>
    </ScriptListItem>
  )

  const listItems = await screen.findAllByRole('listitem')

  expect(listItems[0]).toHaveTextContent('Child Component')
})
