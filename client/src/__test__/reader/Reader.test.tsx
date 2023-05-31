import { render, screen } from '@testing-library/react'
import Reader from 'src/components/ReaderV3/Reader'
import '@testing-library/jest-dom'
import { SceneComponent } from 'src/components/ReaderV3/SceneComponent'
import { Scene } from 'src/components/ReaderV3/reader.types'

const initialState = {
  mode: 'read',
  showAll: false,
  highlight: [],
  expanded: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
}

const scenes = [
  {
    id: 'SCRIPT DETAILS',
    data: [
      {
        type: 'INFO',
        lines: ['first line', 'secon line', 'third line'],
      },
    ],
  },
  {
    id: '7701 TEST. LOCATION',
    data: [
      {
        type: 'INFO',
        lines: ['info line 1', 'info line 1', 'info line 1'],
      },
      {
        type: 'ACTOR',
        name: 'ELENDA',
        lines: ['actor line 1', 'actor line 1', 'actor line 1'],
      },
    ],
  },
] as unknown as Scene[]

describe('Reader.tsx', () => {
  test('Renders scene ids', async () => {
    render(
      <Reader initialState={initialState}>
        {scenes.map((scene, index) => (
          <SceneComponent key={index} scene={scene} />
        ))}
      </Reader>
    )

    screen.getByText(scenes[0].id)
    screen.getByText(scenes[1].id)
  })
})
