export const Line = ({ line }) => {
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
