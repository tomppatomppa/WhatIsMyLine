import { useEffect, useState } from 'react'

import { Line } from './Line'
import { useReaderContext } from './contexts/ReaderContext'

export const Scene = ({ scene }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { options } = useReaderContext()

  //TODO: when scene is manually expanded,
  //close all doesnt work
  useEffect(() => {
    setIsExpanded(options.showAll)
  }, [options.showAll])

  return (
    <section className="border shadow-md my-2 bg-white p-2">
      <h1
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer font-bold"
      >
        {scene.id}
      </h1>
      {isExpanded && (
        <div>
          {scene?.data.map((line, index) => (
            <Line key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
