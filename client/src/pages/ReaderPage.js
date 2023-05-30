import React, { useState } from 'react'
import Navbar from '../components/Navbar'

import Reader from '../components/ReaderV3/Reader'
import { Scene } from '../components/ReaderV3/Scene'
import useCurrentScripts from '../hooks/useCurrentScripts'
import ReaderMenu from '../components/ReaderV3/components/ReaderMenu'

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

const ReaderPage = () => {
  const [selected, setSelected] = useState([])
  const { showScenes } = useCurrentScripts()

  const filtered = showScenes.length
    ? selected?.scenes.filter((item) => showScenes.includes(item.id))
    : selected?.scenes

  return (
    <div className=" bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      <Reader selected={selected} initialState={initialState}>
        <ReaderMenu />
        {filtered?.map((scene, index) => (
          <Scene key={index} scene={scene} />
        ))}
      </Reader>
    </div>
  )
}

export default ReaderPage
