import { useReaderContext } from '../contexts/ReaderContext'
import { Actor, Line } from '../reader.types'
import { useState } from 'react'

interface LineProps {
  line: Line
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export const LineComponent = ({ line, isEditing, setIsEditing }: LineProps) => {
  const { type, name, lines } = line
  const { options, dispatch } = useReaderContext()
  const { info, actor } = options.settings
  const [editedLines, setEditedLines] = useState([...lines])
  const isHighlight = options.highlight.find((item: Actor) => item.id === name)

  const handleClick = () => {
    dispatch({ type: 'HIGHLIGHT_TARGET', payload: { target: name } })
  }

  const onLineChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLine = e.target.value
    setEditedLines((prevLines) => {
      const updatedLines = [...prevLines]
      updatedLines[index] = newLine
      return updatedLines
    })
  }
  if (type === 'INFO') {
    return (
      <span style={info.style}>
        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </span>
    )
  }
  if (type === 'ACTOR') {
    return (
      <div className="my-4">
        <strong className="cursor-pointer" onClick={handleClick}>
          {name}
        </strong>
        <span style={{ ...actor.style }}>
          {editedLines.map((line, index) => (
            <input
              className={`block w-full mx-auto text-center ${
                isEditing ? 'bg-gray-200' : 'bg-transparent'
              }`}
              disabled={!isEditing}
              onChange={(e) => onLineChange(index, e)}
              style={isHighlight?.style}
              key={index}
              value={line}
            />
          ))}
        </span>
        {/* <span style={{ ...actor.style }}>
          {lines.map((line, index) => (
            <p style={isHighlight?.style} key={index}>
              {line}
            </p>
          ))}
        </span> */}
      </div>
    )
  }
  return null
}
