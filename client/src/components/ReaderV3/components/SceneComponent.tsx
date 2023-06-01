import { useState } from 'react'
import { useReaderContext } from '../contexts/ReaderContext'
import { Scene } from '../reader.types'
import EditIcon from './icons/EditIcon'
import ReaderMenuButton from './ReaderMenuButton'
import styles from '../Reader.module.css'
import clsx from 'clsx'
import EditableSceneItem from './EditableSceneItem'

interface SceneProps {
  scene: Scene
  index: number
  onSave: (index: number, scene: Scene) => void
}

export const SceneComponent = ({ scene, index, onSave }: SceneProps) => {
  const { options, dispatch } = useReaderContext()
  const [isEditing, setIsEditing] = useState(false)
  const isExpanded = options.expanded.includes(scene.id)

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
    <section className={clsx(styles.scene, styles[!isEditing ? '' : 'edit'])}>
      <div className="flex items-center justify-center">
        <h1
          onClick={() => handleExpandScene(scene.id)}
          className=" flex-1 cursor-pointer font-bold"
        >
          {scene.id}
        </h1>

        <ReaderMenuButton
          show={isExpanded && !isEditing}
          icon={<EditIcon />}
          onClick={() => setIsEditing(true)}
        />
      </div>
      {isExpanded ? (
        <EditableSceneItem
          scene={scene}
          isEditing={isEditing}
          handleHighlight={handleHighlight}
          handleSave={handleSave}
          setIsEditing={setIsEditing}
          options={options}
        />
      ) : null}
    </section>
  )
}
