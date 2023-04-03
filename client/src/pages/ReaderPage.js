import React, { useState } from 'react'
import Navbar from '../components/Navbar'

import Reader from '../components/ReaderV3/Reader'
import { Scene } from '../components/ReaderV3/Scene'

const ReaderPage = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className="text-center bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      <Reader selected={selected}>
        {selected?.scenes?.map((scene, index) => (
          <Scene key={index} scene={scene} />
        ))}
      </Reader>
    </div>
  )
}

export default ReaderPage
