import { useReaderContext } from './contexts/ReaderContext'
import { Actor, Line } from './reader.types'

interface LineProps {
  line: Line
}
export const LineComponent = ({ line }: LineProps) => {
  const { type, name, lines } = line
  const { options, dispatch } = useReaderContext()
  const { info, actor } = options.settings

  const isHiglight = options.highlight.find((item: Actor) => item.id === name)

  const handleClick = () => {
    dispatch({ type: 'HIGHLIGHT_TARGET', payload: { target: name } })
  }

  if (type === 'INFO') {
    return (
      <div>
        <span style={info.style}>
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </span>
      </div>
    )
  }
  if (type === 'ACTOR') {
    return (
      <div className="my-4">
        <strong className="cursor-pointer" onClick={handleClick}>
          {name}
        </strong>
        <span style={{ ...actor.style }}>
          {lines.map((line, index) => (
            <p style={isHiglight?.style} key={index}>
              {line}
            </p>
          ))}
        </span>
      </div>
    )
  }
  return null
}
