import { useReaderContext } from './contexts/ReaderContext'

export const Line = ({ line }) => {
  const { type, name, lines } = line
  const { options, dispatch } = useReaderContext()
  const { info, actor } = options.settings

  const isHiglight = options.highlight.find((item) => item.id === name)

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
}
