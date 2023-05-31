import { LineComponent } from './LineComponent'
import { useReaderContext } from './contexts/ReaderContext'
import { Scene } from './reader.types'

interface SceneProps {
  scene: Scene
  index: number
}

export const SceneComponent = ({ scene, index }: SceneProps) => {
  const { options, dispatch } = useReaderContext()
  const isExpanded = options.expanded.includes(scene.id)

  const handleExpandScene = (sceneId: string) => {
    if (!sceneId) return
    dispatch({
      type: 'SET_EXPAND',
      payload: {
        sceneId,
      },
    })
  }

  return (
    <section className="border shadow-md my-2 bg-white p-2">
      <div className="flex items-center justify-center ">
        <h1
          onClick={() => handleExpandScene(scene.id)}
          className="shrink-0 hover:bg-blue-200 cursor-pointer font-bold flex-1"
        >
          {scene.id}
        </h1>
      </div>
      {isExpanded && (
        <div>
          {scene?.data.map((line, index) => (
            <LineComponent key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
