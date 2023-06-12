import { Scene, SceneLine } from '../../reader.types'
import { Drag } from 'src/components/drag-and-drop'
import EditorForm from '../forms/EditorForm'
import { useActiveScript, useAddLine, useUpdateScene } from 'src/store/scriptStore'
import uuid from 'react-uuid';

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
  const updateScene = useUpdateScene()
  const addLine = useAddLine()
  const script = useActiveScript()
  
  const onSubmit = (updatedScene: Scene) => {
    const updatedScenes = script?.scenes.map((scene) =>
    scene.id !== updatedScene.id ? scene : updatedScene
    ) ?? [];
  
    const updatedScript = {
      ...script!,
      scenes: updatedScenes,
    };

    updateScene(updatedScript);
    
  }
  const handleAddLine = () => {
    if(!script) return
    const newLine = {id: uuid(), name: "Select Name", type: "ACTOR" as SceneLine, lines: "New Line\n"}
    
    const updatedLines = [...scene.data]
    updatedLines.unshift(newLine)
    addLine({...scene, data: updatedLines})
  
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
          />
        )}
      </div>
    </Drag>
  )
}

export default SceneItem
