import { useState } from 'react'
import Navbar from '../components/Navbar'

import Reader from '../components/ReaderV3/Reader'
import { SceneComponent } from '../components/ReaderV3/components/SceneComponent'

import {
  ReaderConfiguration,
  Scene,
  Script,
} from 'src/components/ReaderV3/reader.types'
import ReaderControlPanel from 'src/components/ReaderV3/components/ReaderControlPanel/ReaderControlPanel'

const initialState = {
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

const ReaderPage = () => {
  const [selected, setSelected] = useState<Script | null>(null)

  const scenes = selected?.scenes.map((scene) => {
    return {
      ...scene,
      data: scene.data.map((line) => {
        return {
          ...line,
          lines: line.lines.join('\n'),
        }
      }),
    }
  })
  const newScript = { ...selected, scenes }

  const onSave = (index: number, scene: Scene) => {
    const oldScene = selected?.scenes[index]

    console.log(oldScene, scene)
  }

  return (
    <div className="bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      {newScript && (
        <Reader
          script={newScript as any}
          initialState={initialState}
          renderItem={(scene, index) => (
            <SceneComponent scene={scene} index={index} onSave={onSave} />
          )}
        >
          <ReaderControlPanel />
        </Reader>
      )}
    </div>
  )
}

export default ReaderPage
