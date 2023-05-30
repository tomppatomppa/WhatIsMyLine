import { Line } from './Line'
import { useReaderContext } from './contexts/ReaderContext'
import { SET_EXPAND } from './actions'

export const Scene = ({ scene }) => {
  const { options, dispatch } = useReaderContext()
  const isExpanded = options.expanded.includes(scene.id)

  return (
    <section className="border shadow-md my-2 bg-white p-2">
      <div className="flex items-center justify-center ">
        <h1
          onClick={() => dispatch(SET_EXPAND({ sceneId: scene.id }))}
          className="shrink-0 hover:bg-blue-200 cursor-pointer font-bold flex-1"
        >
          {scene.id}
        </h1>
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
