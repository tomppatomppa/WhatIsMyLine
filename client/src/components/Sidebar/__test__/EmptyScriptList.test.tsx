import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmptyScriptList from '../Scripts/EmptyScriptList'

describe('EmptyScriptList.tsx', () => {
  test('should render message', async () => {
    render(<EmptyScriptList />)

    expect(await screen.findByText('No Scripts')).toBeInTheDocument()
    expect(await screen.findByText('Upload From Device')).toBeInTheDocument()
    expect(await screen.findByText('Or Google Drive')).toBeInTheDocument()
  })
})
