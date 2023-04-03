import React, { useState } from 'react'
import Navbar from '../components/Navbar'

import Reader from '../components/ReaderV3/Reader'
import { Scene } from '../components/ReaderV3/Scene'
import useCurrentScripts from '../hooks/useCurrentScripts'

const ReaderPage = () => {
  const [selected, setSelected] = useState(null)
  const { showScenes } = useCurrentScripts()

  const filtered = showScenes.length
    ? selected?.scenes.filter((item) => showScenes.includes(item.id))
    : selected?.scenes

  return (
    <div className="text-center bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      <Reader selected={selected}>
        {filtered?.map((scene, index) => (
          <Scene key={index} scene={scene} />
        ))}
      </Reader>
    </div>
  )
}

export default ReaderPage
