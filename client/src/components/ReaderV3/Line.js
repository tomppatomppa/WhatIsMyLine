import useCurrentScripts from '../../hooks/useCurrentScripts'
import { useReaderContext } from './contexts/ReaderContext'

export const Line = ({ line }) => {
  const { type, name, lines } = line
  const { options } = useReaderContext()
  const { info, actor } = options.settings

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
      <div>
        {name}
        <span style={actor.style}>
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </span>
      </div>
    )
  }
}
