import {
  ReaderConfiguration,
  Scene,
  Script,
} from 'src/components/ReaderV3/reader.types'
import {
  Reader,
  ReaderControlPanel,
  SceneComponent,
} from 'src/components/ReaderV3'

const initialState = {
  highlight: [],
  expanded: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
} as ReaderConfiguration

interface ReaderPageProps {
  selected: Script
}
const ReaderPage = ({ selected }: ReaderPageProps) => {
  const scenes = selected?.scenes.map((scene) => {
    return {
      ...scene,
      data: scene.data.map((line) => {
        return {
          ...line,
          lines: line.lines.join('\n'),
        }
      }),
    }
  })
  const newScript = { ...selected, scenes }

  const onSave = (index: number, scene: Scene) => {
    const oldScene = selected?.scenes[index]
    console.log(oldScene, scene)
  }

  return (
    <div className="bg-red-900">
      {newScript && (
        <Reader
          script={newScript as any}
          initialState={initialState}
          renderItem={(scene, index) => (
            <SceneComponent scene={scene} index={index} onSave={onSave} />
          )}
        >
          <ReaderControlPanel />
        </Reader>
      )}
    </div>
  )
}

export default ReaderPage
