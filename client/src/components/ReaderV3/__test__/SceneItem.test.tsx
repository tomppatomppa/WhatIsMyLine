import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import SceneItem from '../components/Scene/SceneItem'
import { script } from './testData'

import { renderWithDragAndDrop } from 'src/__test__/reader/utils'

jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: jest.fn(() => ({
    listening: true,
    transcript: 'test',
  })),
}))

test('renders scene item with correct id', async () => {
  renderWithDragAndDrop(
    <SceneItem
      sceneIndex={1}
      scene={script.scenes[0]}
      handleSetExpanded={() => {}}
      show={true}
    />
  )
  const textArea = screen.getAllByDisplayValue(script.scenes[0].data[0].lines)
  expect(textArea).toBeDefined()
  screen.debug()
})
