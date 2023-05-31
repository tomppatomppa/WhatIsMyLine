import { useState } from 'react'
import Navbar from '../components/Navbar'

import Reader from '../components/ReaderV3/Reader'
import { SceneComponent } from '../components/ReaderV3/components/SceneComponent'

import ReaderMenu from '../components/ReaderV3/components/ReaderMenu'
import {
  ReaderConfiguration,
  Scene,
  Script,
} from 'src/components/ReaderV3/reader.types'
import ReaderHeading from 'src/components/ReaderV3/components/ReaderHeading'

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

const ReaderPage = () => {
  const [selected, setSelected] = useState<Script | null>(null)
  const onSave = (index: number, scene: Scene) => {
    const updated = selected?.scenes[index]
    console.log(updated)
  }
  return (
    <div className="bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      {selected && (
        <Reader
          script={selected}
          initialState={initialState}
          renderItem={(scene, index) => (
            <SceneComponent scene={scene} index={index} onSave={onSave} />
          )}
        >
          <ReaderHeading />
          <ReaderMenu />
        </Reader>
      )}
    </div>
  )
}

export default ReaderPage
