import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Reader } from '../Reader'

import { script } from './testData'

jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: jest.fn(() => ({
    listening: true,
    transcript: 'test',
  })),
}))

test('renders scene items with correct id', async () => {
  render(<Reader script={script} handleDragEnd={() => {}} />)

  const sceneItems = await screen.findAllByRole('button')

  expect(sceneItems).toHaveLength(script.scenes.length)
  sceneItems.forEach((scene, index) => {
    expect(scene).toHaveTextContent(script.scenes[index].id)
  })
})

test('When clicked, expand scene and shows data component', async () => {
  render(<Reader script={script} handleDragEnd={() => {}} />)

  //Enable to wait for buttons to render
  await screen.findAllByRole('button')

  fireEvent.click(screen.getByText(script.scenes[0].id))
  await waitFor(() => {
    expect(screen.getByText(script.scenes[0].data[0].lines)).toBeInTheDocument()
  })
})
