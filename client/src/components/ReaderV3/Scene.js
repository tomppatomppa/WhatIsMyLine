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

  const NoteButton = () => {
    const [note, setNote] = useState(false)

    const handleNote = () => {
      if (note) {
        console.log('save changes')
      }
      setNote(!note)
    }
    return (
      <div
        className={`${
          note ? 'border-red-300 ' : 'border-blue-300 '
        } self-center border-2 rounded-md p-1`}
      >
        <button onClick={handleNote}>{note ? 'save' : 'Note'}</button>
      </div>
    )
  }

  return (
    <section className="relative border shadow-md my-2 bg-white p-2">
      <div className="flex items-center justify-center ">
        <h1
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 cursor-pointer font-bold flex-1"
        >
          {scene.id}
        </h1>
        <NoteButton />
      </div>

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
