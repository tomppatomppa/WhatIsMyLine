import { Form, Formik } from 'formik'
import { Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'
import { Actor, LineType, Scene } from '../../reader.types'
import SceneEditorPanel from './SceneEditorPanel'
import { useReaderContext } from '../../contexts/ReaderContext'
import { Field } from 'formik'
import { Drag } from 'src/components/drag-and-drop'
import { DeleteIcon } from '../icons'
import { ConditionalField } from '../forms/ConditionalField'
import { FormikTextArea } from '../forms/FormikTextArea'

interface EditorFormProps {
  scene: Scene
  sceneIndex: number
  onSubmit: (scene: Scene) => void
  addLine: () => void
  deleteLine: (lineIndex: number) => void
}

const EditorForm = ({
  scene,
  sceneIndex,
  onSubmit,
  addLine,
  deleteLine,
}: EditorFormProps) => {
  const { options, dispatch } = useReaderContext()
  const [isEditing, setIsEditing] = useState(false)

  const getLineStyle = (type: LineType) => {
    const style = options.settings[type.toLowerCase()].style
    return style || {}
  }

  const getTextAreaColor = (name: string) => {
    const actor = options?.highlight.find((item: Actor) => item.id === name)
    return actor ? actor.style : {}
  }

  return (
    <div
      className={`border-l-4 ${
        isEditing ? 'border-red-700' : 'border-green-300'
      }`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={scene as Scene}
        onSubmit={(values) => {
          setIsEditing(false)
          onSubmit(values)
        }}
      >
        {({ values, dirty }) => (
          <Drop key={scene.id} id={scene.id} type="droppable-item">
            <Form autoComplete="off">
              <SceneEditorPanel
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                addLine={addLine}
              />
              {values.data.map((line: any, lineIndex: number) => (
                <Drag
                  className="mt-3"
                  key={line.id}
                  id={line.id}
                  index={lineIndex}
                  isDragDisabled={false}
                >
                  <div className="w-full flex flex-col " key={lineIndex}>
                    <ConditionalField
                      key={lineIndex}
                      show={isEditing}
                      onShow={() => {}}
                      onCollapse={() => {
                        if (dirty) console.log('unsaved changes')
                      }}
                    >
                      <div className="w-full bg-neutral-200 flex justify-end ">
                        <label htmlFor={`data[${lineIndex}].type`}>
                          Line Type
                        </label>
                        <Field
                          className="border w-6 border-black"
                          as="select"
                          name={`data[${lineIndex}].type`}
                        >
                          <option value="INFO">Info</option>
                          <option value="ACTOR">Actor</option>
                        </Field>
                        <button
                          className="w-auto"
                          type="button"
                          onClick={() => deleteLine(lineIndex)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </ConditionalField>
                    <strong
                      onClick={() => {
                        if (!isEditing) {
                          dispatch({
                            type: 'HIGHLIGHT_TARGET',
                            payload: { target: line.name },
                          })
                        }
                      }}
                    >
                      <Field
                        style={getLineStyle(line.type)}
                        disabled={!isEditing || line.type === 'INFO'}
                        name={`data[${lineIndex}].name`}
                      />
                    </strong>
                    <FormikTextArea
                      style={{
                        ...getLineStyle(line.type),
                        ...getTextAreaColor(line.name),
                      }}
                      disabled={!isEditing}
                      type={line.type}
                      lineName={line.name}
                      name={`data[${lineIndex}].lines`}
                    />
                  </div>
                </Drag>
              ))}
            </Form>
          </Drop>
        )}
      </Formik>
    </div>
  )
}

export default EditorForm
