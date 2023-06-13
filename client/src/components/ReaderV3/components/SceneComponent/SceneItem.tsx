import { Scene, SceneLine } from '../../reader.types'
import { Drag } from 'src/components/drag-and-drop'
import EditorForm from '../forms/EditorForm'
import { useUpdateScript } from 'src/store/scriptStore'
import uuid from 'react-uuid'

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

  const handleAddLine = () => {
    const newLine = {
      id: uuid(),
      name: 'Select Name',
      type: 'ACTOR' as SceneLine,
      lines: 'New Line\n',
    }
    const updatedLines = [...scene.data]
    updatedLines.unshift(newLine)
    updateScript({ ...scene, data: updatedLines })
  }

  const handleDeleteLine = (lineIndex: number) => {
    const updatedLines = [...scene.data]
    updatedLines.splice(lineIndex, 1)
    updateScript({ ...scene, data: updatedLines })
  }

  return (
    <Drag
      className="flex justify-center items-center gap-4 my-4 px-1 mx-auto"
      key={scene.id}
      id={scene.id}
      index={sceneIndex}
      isDragDisabled={false}
    >
      <div className="w-full">
        <h2
          onClick={handleSetExpanded}
          className="border p-4 w-full bg-primaryLight border-primary"
        >
          {scene.id}
        </h2>
        {show && (
          <EditorForm
            scene={scene}
            sceneIndex={sceneIndex}
            onSubmit={onSubmit}
            addLine={handleAddLine}
            deleteLine={handleDeleteLine}
          />
        )}
      </div>
    </Drag>
  )
}

export default SceneItem
