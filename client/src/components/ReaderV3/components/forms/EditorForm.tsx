import { Field, Form, Formik } from 'formik'
import { Drag, Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'
import { ConditionalField } from './ConditionalField'
import { FormikTextArea } from './FormikTextArea'
import SceneEditorActions from '../SceneComponent/SceneEditorActions'
import { DeleteIcon } from '../icons'

const EditorForm = ({ scene, AddLine, sceneIndex, DeleteLine }: any) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Formik
      enableReinitialize={true}
      initialValues={scene}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, dirty, resetForm }) => (
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <Form autoComplete="off">
            <SceneEditorActions
              isEditing={isEditing}
              AddLine={AddLine}
              sceneIndex={sceneIndex}
              setIsEditing={setIsEditing}
            />
            {values.data.map((line: any, lineIndex: number) => {
              return (
                <Drag
                  className="draggable"
                  key={line.id}
                  id={line.id}
                  index={lineIndex}
                  isDragDisabled={!isEditing}
                >
                  <div className="w-full flex flex-col" key={lineIndex}>
                    <ConditionalField
                      key={lineIndex}
                      show={isEditing}
                      onShow={() => {}}
                      onCollapse={() => {
                        if (!dirty) return
                        const result = window.confirm(
                          'There are unsaved changes!\nSave or Discard.'
                        )
                        if (result) {
                          console.log('Save Changes')
                        } else {
                          console.log('Discard Changes')
                          resetForm()
                        }
                        return
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
                          onClick={() => DeleteLine(sceneIndex, lineIndex)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </ConditionalField>
                    <Field
                      disabled={values.data[lineIndex].type === 'INFO'}
                      className="text-center"
                      name={`data[${lineIndex}].name`}
                    />
                    <FormikTextArea
                      disabled={!isEditing}
                      type={line.type}
                      lineName={line.name}
                      name={`data[${lineIndex}].lines`}
                    />
                  </div>
                </Drag>
              )
            })}
          </Form>
        </Drop>
      )}
    </Formik>
  )
}

export default EditorForm
