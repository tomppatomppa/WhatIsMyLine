import { Drag } from 'src/components/drag-and-drop'
import EditorForm from '../forms/EditorForm'
import { Scene } from '../../reader.types'

interface SceneListProps {
  scenes: Scene[]
  handleSetExpanded: (value: string) => void
  expanded: string[]
}
const SceneList = ({ scenes, handleSetExpanded, expanded }: SceneListProps) => {
  return (
    <>
      {scenes.map((scene, sceneIndex) => {
        return (
          <Drag
            className="draggable-category"
            key={scene.id}
            id={scene.id}
            index={sceneIndex}
            isDragDisabled={false}
          >
            <div className="category-container">
              <h2 onClick={() => handleSetExpanded(scene.id)} className="item">
                {scene.id}
              </h2>
              {expanded.includes(scene.id) && (
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
      })}
    </>
  )
}

export default SceneList
