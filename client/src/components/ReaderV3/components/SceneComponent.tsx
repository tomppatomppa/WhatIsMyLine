import { useState } from 'react'
import { LineComponent } from './LineComponent'
import { useReaderContext } from '../contexts/ReaderContext'
import { Scene } from '../reader.types'
import EditIcon from './icons/EditIcon'
import ReaderMenuButton from './ReaderMenuButton'
import styles from '../Reader.module.css'
import clsx from 'clsx'
interface SceneProps {
  scene: Scene
  index: number
  onSave: (index: number, scene: Scene) => void
}

export const SceneComponent = ({ scene, index, onSave }: SceneProps) => {
  const { options, dispatch } = useReaderContext()
  const isExpanded = options.expanded.includes(scene.id)
  const [isEditing, setIsEditing] = useState(false)
  const [modifiedScene, setModifiedScene] = useState<Scene | null>(null)

  const handleExpandScene = (sceneId: string) => {
    if (!sceneId) return
    dispatch({
      type: 'SET_EXPAND',
      payload: {
        sceneId,
      },
    })
  }

  const handleSetEditing = () => {
    setIsEditing(true)
  }
  const handleSave = () => {
    if (!modifiedScene) return
    onSave(index, modifiedScene)
  }
  const cancelEdit = () => {
    setIsEditing(false)
    setModifiedScene(null)
  }

  return (
    <section className={clsx(styles.scene, styles[!isEditing ? '' : 'edit'])}>
      <div className="flex items-center justify-center ">
        <h1
          onClick={() => handleExpandScene(scene.id)}
          className="shrink-0 hover:bg-blue-200 cursor-pointer font-bold w-1/2"
        >
          {scene.id}
        </h1>
        <ReaderMenuButton
          className="hover:bg-green-100 rounded-md absolute right-2 "
          show={isExpanded && !isEditing}
          onClick={handleSetEditing}
          icon={<EditIcon />}
        />
        <div className="flex absolute right-2 gap-2">
          <ReaderMenuButton
            className="hover:text-red-900 p-1 right-2 "
            show={isEditing}
            onClick={cancelEdit}
            text="cancel"
          />
          <ReaderMenuButton
            className="hover:bg-emerald-400 border bg-emerald-500 p-1 right-2 "
            show={isEditing}
            onClick={handleSave}
            text="save"
          />
        </div>
      </div>
      {isExpanded && (
        <div>
          {scene?.data.map((line, index) => (
            <LineComponent key={index} line={line} />
          ))}
        </div>
      )}
    </section>
  )
}
