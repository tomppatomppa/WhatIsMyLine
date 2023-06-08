import { Scene } from '../../reader.types'
import { Drag } from 'src/components/drag-and-drop'
import EditorForm from '../forms/EditorForm'

interface SceneItemProps {
    scene: Scene
    sceneIndex: number
    handleSetExpanded: () => void
    show: boolean
}
const SceneItem = ({scene, sceneIndex, handleSetExpanded, show}: SceneItemProps) => {
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
            AddLine={() => console.log('Add line')}
            sceneIndex={sceneIndex}
            DeleteLine={() => console.log('Delete line')}
          />
        )}
      </div>
    </Drag>
  )
}

export default SceneItem