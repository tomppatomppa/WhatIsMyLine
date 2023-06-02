import { useState } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { Scene } from '../../reader.types'
import EditIcon from '../icons/EditIcon'
import styles from '../../Reader.module.css'
import clsx from 'clsx'
import EditableSceneItem from './EditableSceneItem'

import DelayWrapper from 'src/hooks/useDelayUnmount/useDelayUnmount'
import { CancelIcon, ConfirmIcon } from '../icons'
import ReaderMenuButton from '../ReaderControlPanel/ReaderMenuButton'

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

  const handleExpandScene = (sceneId: string) => {
    if (!sceneId) return
    dispatch({
      type: 'SET_EXPAND',
      payload: {
        sceneId,
      },
    })
  }

  const handleHighlight = (name: string) => {
    dispatch({ type: 'HIGHLIGHT_TARGET', payload: { target: name } })
  }

  const handleSave = (scene: Scene) => {
    onSave(index, scene)
  }

  return (
    <section className={clsx(styles.scene, styles[variant])}>
      <div className="flex justify-center ">
        <span className="flex-1" />
        <h1
          onClick={() => handleExpandScene(scene.id)}
          className="cursor-pointer
           mx-auto justify-center font-bold"
        >
          {scene.id}
        </h1>
        <div className="flex flex-1 justify-end items-center gap-4 ">
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
        </div>
      </div>
      <DelayWrapper isMounted={isExpanded}>
        <EditableSceneItem
          scene={scene}
          isEditing={isEditing}
          handleHighlight={handleHighlight}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
          options={options}
        />
      </DelayWrapper>
    </section>
  )
}
export default SceneComponent
