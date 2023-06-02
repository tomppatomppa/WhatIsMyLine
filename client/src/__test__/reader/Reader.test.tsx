import { render, screen } from '@testing-library/react'
import Reader from 'src/components/ReaderV3/Reader'
import '@testing-library/jest-dom'

import {
  ReaderConfiguration,
  Script,
} from 'src/components/ReaderV3/reader.types'
import { SceneComponent } from 'src/components/ReaderV3'

const initialState = {
  mode: 'read',
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
} as ReaderConfiguration

const script = {
  filename: 'testfile',
  scenes: [
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
  ],
} as Script

describe('Reader.tsx', () => {
  test('Renders scene ids', async () => {
    render(
      <Reader
        script={script}
        initialState={initialState}
        renderItem={(scene, index) => (
          <SceneComponent scene={scene} index={index} onSave={() => {}} />
        )}
      ></Reader>
    )

    screen.getByText(script.scenes[0].id)
    screen.getByText(script.scenes[1].id)
  })
})
