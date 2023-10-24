import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PanelWidget from '../components/ScenePanel/PanelWidget'
import PanelComponent from '../components/ScenePanel/PanelComponent'

jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: jest.fn(() => ({
    listening: true,
    transcript: 'test',
  })),
}))

const optionLabels = ['scroll', 'rehearse', 'edit']

test('renders panel widget with options', async () => {
  render(
    <PanelWidget>
      <PanelComponent />
    </PanelWidget>
  )

  const options = await screen.findAllByRole('option')

  options.forEach((option, index) => {
    expect(option).toHaveValue(optionLabels[index])
  })
  expect(options).toHaveLength(3)
})
