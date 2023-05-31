import { useState } from 'react'
import { useReaderContext } from '../contexts/ReaderContext'
import { Scene } from '../reader.types'
import EditIcon from './icons/EditIcon'
import ReaderMenuButton from './ReaderMenuButton'
import styles from '../Reader.module.css'
import clsx from 'clsx'
import { Formik, Field, FieldArray } from 'formik'

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
  const { info, actor } = options.settings

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

  const handleSetEditing = () => {
    setIsEditing(true)
  }
  const handleSave = () => {
    onSave(index, modifiedScene as any)
    setIsEditing(false)
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
            variant="cancel"
            show={isEditing}
            onClick={cancelEdit}
            text="cancel"
          />
          <ReaderMenuButton
            variant="confirm"
            className="hover:bg-emerald-400 border bg-emerald-500 p-1 right-2 "
            show={isEditing}
            onClick={handleSave}
            text="save"
          />
        </div>
      </div>
      {isExpanded && (
        <Formik
          onSubmit={(values) => console.log(values)}
          initialValues={scene}
        >
          <fieldset disabled={!isEditing}>
            <FieldArray
              name="data"
              render={(arrayHelpers) => (
                <div>
                  {scene.data.map((line, index) => (
                    <div
                      style={line.type === 'INFO' ? info.style : actor.style}
                      key={index}
                    >
                      <div className="my-2 w-full">
                        <Field
                          className="hover:cursor-pointer"
                          onClick={() => {
                            if (!isEditing && line.type === 'ACTOR') {
                              handleHighlight(line.name)
                            }
                          }}
                          style={
                            line.type === 'ACTOR' ? actor.style : info.style
                          }
                          name={`data[${index}].name`}
                        />
                        {line.lines.map((_, lineIndex) => (
                          <Field
                            style={
                              line.type === 'ACTOR' ? actor.style : info.style
                            }
                            key={lineIndex}
                            name={`data[${index}].lines[${lineIndex}]`}
                            className="w-full"
                          />
                        ))}

                        {/* <button
                      type="button"
                      onClick={() => arrayHelpers.remove(index)}
                    >
                      -
                    </button> */}
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="bg-red-900">
                    submit
                  </button>
                  <button
                    type="button"
                    onClick={() => arrayHelpers.push({ name: '', age: '' })}
                  >
                    +
                  </button>
                </div>
              )}
            ></FieldArray>
          </fieldset>
        </Formik>
      )}
    </section>
  )
}
