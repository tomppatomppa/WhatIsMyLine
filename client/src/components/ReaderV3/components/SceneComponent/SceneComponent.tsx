import { useState } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { Scene } from '../../reader.types'
import EditIcon from '../icons/EditIcon'
import styles from '../../Reader.module.css'
import clsx from 'clsx'
import EditableSceneItem from './EditableSceneItem'

import DelayWrapper from 'src/hooks/useDelayUnmount/useDelayUnmount'
import SceneEditor from './SceneEditor'

interface SceneProps {
  scene: Scene
  index: number
  onSave: (index: number, scene: Scene) => void
}

const SceneComponent = ({ scene, index, onSave }: SceneProps) => {
  const { options, dispatch } = useReaderContext()
  const [isEditing, setIsEditing] = useState(false)
  const isExpanded = options.expanded.includes(scene.id)
  const variant = isExpanded && !isEditing ? 'open' : isEditing ? 'edit' : ''
  console.log(scene)
  const handleExpandScene = (sceneId: string) => {
    if (!sceneId || isEditing) return
    dispatch({
      type: 'SET_EXPAND',
      payload: {
        sceneId,
      },
    })
  }

  const handleHighlight = (name: string) => {
    if (isEditing) return
    dispatch({ type: 'HIGHLIGHT_TARGET', payload: { target: name } })
  }

  const handleSave = (scene: Scene) => {
    onSave(index, scene)
  }

  return (
    <section className={clsx(styles.scene, styles[variant])}>
      <fieldset disabled={!isEditing}>
        <div className="flex justify-center">
          <h1
            id="scene-id"
            onClick={() => handleExpandScene(scene.id)}
            className="cursor-pointer font-bold text-center"
          >
            {scene.id}
          </h1>

          {/* <div className="flex flex-1 justify-end items-center gap-4 ">
          <ReaderMenuButton
            type="submit"
            icon={<ConfirmIcon />}
            show={isEditing && isExpanded}
          />
          <button
            className={clsx(isExpanded ? 'visible' : 'invisible')}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <CancelIcon /> : <EditIcon />}
          </button>
        </div> */}
        </div>
        <DelayWrapper isMounted={isExpanded}>
          <SceneEditor
            isEditing={isEditing}
            scene={scene}
            isExpanded={isExpanded}
            setIsEditing={setIsEditing}
            handleHighlight={handleHighlight}
          />
        </DelayWrapper>
        {/* <EditableSceneItem
          scene={scene}
          isEditing={isEditing}
          handleHighlight={handleHighlight}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
          options={options}
        /> */}
        {/* </DelayWrapper> */}
      </fieldset>
    </section>
  )
}
export default SceneComponent
