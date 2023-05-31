import { ReaderConfiguration, Scene } from '../reader.types'

import { getLineStyle } from '../utils'

interface StaticSceneItemProps {
  scene: Scene
  handleHighlight: (value: string) => void
  options: ReaderConfiguration
}

const StaticSceneItem = (props: StaticSceneItemProps) => {
  const { scene, handleHighlight, options } = props

  return (
    <>
      {scene.data.map(({ type, name, lines }, index) => (
        <div key={index}>
          <button
            className="font-bold"
            style={getLineStyle(type, options) as any}
            onClick={() => handleHighlight(name)}
          >
            {name}
          </button>
          <div>
            {lines.map((line, index) => (
              <div key={index} style={getLineStyle(type, options, name) as any}>
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default StaticSceneItem
