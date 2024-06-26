import { Scene } from '../../reader.types'

import SceneForm from './SceneForm'

import PanelWidget from '../PanelWidget/PanelWidget'
import PanelComponent from '../PanelWidget/PanelComponent'
import { ConditionalField } from '../../../common/ConditionalField'
import { useUpdateScript } from '../../../../store/scriptStore'
import { Drag } from '../../../drag-and-drop/Drag'

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

  const onSubmit = async (updatedScene: Scene) => {
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
      isDragDisabled={true} //Add to settings
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
    <h1
      onClick={handleExpandScene}
      className="border border-gray-300 bg-gray-200 rounded-sm font-semibold p-4 w-full shadow-lg"
    >
      {title}
    </h1>
  )
}

export default SceneItem
