import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import useCurrentScripts from '../hooks/useCurrentScripts'
import Reader from '../components/ReaderV3/Reader'

const Line = ({ line }) => {
  const { type, name, lines } = line

  const styleInfo = {
    textAlign: 'left',
  }
  const styleActor = {
    textAlign: 'center',
  }

  if (type === 'INFO') {
    return (
      <div>
        <span style={styleInfo}>
          {lines.map((line) => (
            <p>{line}</p>
          ))}
        </span>
      </div>
    )
  }
  if (type === 'ACTOR') {
    return (
      <div>
        {name}
        <span style={styleActor}>
          {lines.map((line) => (
            <p>{line}</p>
          ))}
        </span>
      </div>
    )
  }
}
const Scene = ({ scene }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { showScenes } = useCurrentScripts()
  const { id, data } = scene
  if (!showScenes.includes(id) && showScenes.length) return

  return (
    <section className="border shadow-md my-2">
      <h1
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer font-bold"
      >
        {id}
      </h1>
      {isExpanded && (
        <div>
          {data.map((line) => (
            <Line line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
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
