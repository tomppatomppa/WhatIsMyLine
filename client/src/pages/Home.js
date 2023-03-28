import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import ScriptReader from '../components/Reader/ScriptReader'
import ScriptReaderController from '../components/Reader/ScriptReaderController'
import ScriptReaderItem from '../components/Reader/ScriptReaderItem'
import ScriptReaderScene from '../components/Reader/ScriptReaderScene'

const Home = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className=" text-center">
      <Navbar selected={selected} setSelected={setSelected} />
      {selected ? (
        <ScriptReader
          script={selected}
          renderItems={
            <ScriptReaderItem>
              <ScriptReaderScene />
              <ScriptReaderController />
            </ScriptReaderItem>
          }
        ></ScriptReader>
      ) : (
        <h1 className="text-4xl">No file selected</h1>
      )}
    </div>
  )
}

export default Home
