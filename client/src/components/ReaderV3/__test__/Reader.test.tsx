import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Reader } from '../Reader'
import { Script } from '../reader.types'

const script: Script = {
  filename: 'testfile.pdf',
  script_id: '35a2f575-6fff-4f93-b3c2-5e17f0235b31',
  scenes: [
    {
      id: 'SCRIPT DETAILS',
      data: [{ id: '1', type: 'INFO', name: '', lines: '' }],
    },
    {
      id: '7701 INT. KÄLLAREN',
      data: [{ id: '2', type: 'INFO', name: '', lines: '' }],
    },
  ],
}

jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: jest.fn(() => ({
    listening: true,
    transcript: 'test',
  })),
}))
test('renders list item with active class', async () => {
  render(<Reader script={script} handleDragEnd={() => {}} />)

  const listItems = await screen.findAllByRole('button')

  listItems.forEach((listItem, index) => {
    expect(listItem).toHaveTextContent(script.scenes[index].id)
  })
})
