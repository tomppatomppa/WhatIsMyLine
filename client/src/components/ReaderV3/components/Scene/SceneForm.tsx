import { Form, Formik } from 'formik'
import { Drop } from 'src/components/drag-and-drop'
import { Actor, LineType, Scene } from '../../reader.types'
import { useReaderContext } from '../../contexts/ReaderContext'
import { Field } from 'formik'
import { Drag } from 'src/components/drag-and-drop'
import { DeleteIcon } from '../../../icons'
import { ConditionalField } from '../../../common/ConditionalField'
import { FormikTextArea } from './FormikTextArea'

import LineField from './LineField'

interface EditorFormProps {
  children?: React.ReactNode
  scene: Scene
  onSubmit: (scene: Scene) => void
  deleteLine: (lineIndex: number) => void
}

const SceneForm = ({
  scene,
  onSubmit,
  deleteLine,
  children,
}: EditorFormProps) => {
  const { options } = useReaderContext()
  const isEditing = options.isEditing.includes(scene.id)
  const formState = isEditing ? 'border-red-700' : 'border-green-300'

  const getLineStyle = (type: LineType) => {
    const style = options.settings[type.toLowerCase()].style
    return style || {}
  }

  const getTextAreaColor = (name: string) => {
    const actor = options?.highlight.find((item: Actor) => item.id === name)
    return actor ? actor.style : {}
  }

  return (
    <div className={`border-l-4 ${formState}`}>
      <Formik
        enableReinitialize={true}
        initialValues={scene}
        onSubmit={(values) => {
          onSubmit(values)
        }}
      >
        {({ values }) => (
          <Drop key={scene.id} id={scene.id} type="droppable-item">
            {/* PanelWidget */}
            {children}
            <Form autoComplete="off">
              {values.data.map((line: any, lineIndex: number) => (
                <Drag
                  className="mt-3"
                  key={line.id}
                  id={line.id}
                  index={lineIndex}
                  isDragDisabled={false}
                >
                  <div className="w-full flex flex-col" key={lineIndex}>
                    {/* Show when edit is enabled */}
                    <ConditionalField
                      key={lineIndex}
                      show={isEditing}
                      onShow={() => {}}
                      onCollapse={() => {}}
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
                    {/* Line type e.g ACTOR | INFO */}
                    <LineField
                      id={`${line.id}`}
                      style={getLineStyle(line.type)}
                      disabled={!isEditing || line.type === 'INFO'}
                      name={`data[${lineIndex}].name`}
                      scrollToElementId={options.currentScrollTarget}
                    />
                    {/* Line text */}
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

export default SceneForm
