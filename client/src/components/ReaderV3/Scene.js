import { useState } from 'react'
import useCurrentScripts from '../../hooks/useCurrentScripts'
import { Line } from './Line'

export const Scene = ({ scene }) => {
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
          {data.map((line, index) => (
            <Line key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
