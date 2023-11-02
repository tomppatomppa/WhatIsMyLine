import { Scene } from '../../reader.types'
import { Drag } from 'src/components/drag-and-drop'
import { useUpdateScript } from 'src/store/scriptStore'
import SceneForm from './SceneForm'
import { ConditionalField } from 'src/components/common/ConditionalField'
import PanelWidget from '../PanelWidget/PanelWidget'
import PanelComponent from '../PanelWidget/PanelComponent'

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
  //TODO: possibly add show as localstate [show, setShow] = useState(false)
  //Is closeAll functionality needed?

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
      id={scene.id}
      className="flex justify-center items-center my-4 px-1 mx-auto"
      key={scene.id}
      index={sceneIndex}
      isDragDisabled={false} //Add to global settings
    >
      <div className="lg:w-2/3 w-full mx-auto">
        <SceneHeader title={scene.id} handleExpandScene={handleSetExpanded} />
        <ConditionalField show={show} onCollapse={() => {}} onShow={() => {}}>
          <SceneForm
            scene={scene}
            onSubmit={onSubmit}
            deleteLine={handleDeleteLine}
          >
            <PanelWidget>
              <PanelComponent />
            </PanelWidget>
          </SceneForm>
        </ConditionalField>
      </div>
    </Drag>
  )
}

interface SceneHeaderProps {
  handleExpandScene: () => void
  title: string
}

const SceneHeader = ({ title, handleExpandScene }: SceneHeaderProps) => {
  return (
    <h2
      onClick={handleExpandScene}
      className="border rounded-sm font-semibold p-4 w-full bg-primaryLight border-primary"
    >
      {title}
    </h2>
  )
}

export default SceneItem
