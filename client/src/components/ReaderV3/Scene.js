import { useEffect, useState } from 'react'
import useCurrentScripts from '../../hooks/useCurrentScripts'
import { Line } from './Line'
import { useReaderContext } from './contexts/ReaderContext'

export const Scene = ({ scene }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { options } = useReaderContext()
  const { showScenes } = useCurrentScripts()
  const { id, data } = scene

  //TODO: when scene is manually expanded,
  //close all doesnt work
  useEffect(() => {
    setIsExpanded(options.showAll)
  }, [options.showAll])

  if (!showScenes.includes(id) && showScenes.length) return //TODO filter earlier

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
          {data.map((line, index) => (
            <Line key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
