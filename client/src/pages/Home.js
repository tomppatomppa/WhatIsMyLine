import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Reader from '../components/ReaderV2/Reader'

const Home = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className="text-center bg-orange-50">
      <Navbar selected={selected} setSelected={setSelected} />
      {selected ? (
        <Reader selected={selected} />
      ) : (
        <h1 className="text-4xl">No file selected</h1>
      )}
    </div>
  )
}

export default Home
