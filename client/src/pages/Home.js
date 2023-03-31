import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import ReaderV2 from '../components/ReaderV2/ReaderV2'

const Home = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className=" text-center">
      <Navbar selected={selected} setSelected={setSelected} />
      {selected ? (
        <ReaderV2 selected={selected} />
      ) : (
        <h1 className="text-4xl">No file selected</h1>
      )}
    </div>
  )
}

export default Home
