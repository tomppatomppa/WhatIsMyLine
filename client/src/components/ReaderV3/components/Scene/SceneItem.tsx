import { Scene } from '../../reader.types'
import { Drag } from 'src/components/drag-and-drop'
import { useUpdateScript } from 'src/store/scriptStore'
import SceneForm from './SceneForm'

interface SceneItemProps {
  scene: Scene
  sceneIndex: number
  handleSetExpanded: () => void
  show: boolean
}

const SceneItem = ({
  scene,
  sceneIndex,
  handleSetExpanded,
  show,
}: SceneItemProps) => {
  const updateScript = useUpdateScript()

  const onSubmit = (updatedScene: Scene) => {
    updateScript(updatedScene)
  }

  const handleDeleteLine = (lineIndex: number) => {
    const updatedLines = [...scene.data]
    updatedLines.splice(lineIndex, 1)
    updateScript({ ...scene, data: updatedLines })
  }

  return (
    <Drag
      className="flex justify-center items-center my-4 px-1 mx-auto"
      key={scene.id}
      id={scene.id}
      index={sceneIndex}
      isDragDisabled={false}
    >
      <div className="lg:w-2/3 w-full mx-auto">
        <SceneHeader title={scene.id} onClick={handleSetExpanded} />

        {show ? (
          <SceneForm
            scene={scene}
            onSubmit={onSubmit}
            deleteLine={handleDeleteLine}
          />
        ) : null}
      </div>
    </Drag>
  )
}

interface SceneHeaderProps {
  onClick: () => void
  title: string
}
const SceneHeader = ({ title, onClick }: SceneHeaderProps) => {
  return (
    <h2
      onClick={onClick}
      className="border p-4 w-full bg-primaryLight border-primary"
    >
      {title}
    </h2>
  )
}

export default SceneItem
