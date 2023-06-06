import { Field, Form, Formik } from 'formik'

import { Drag, Drop } from 'src/components/drag-and-drop'

import { useState } from 'react'
import { ConditionalField } from './ConditionalField'
import { FormikTextArea } from './FormikTextArea'

const components = [{ componentType: 'textarea', component: FormikTextArea }]

const EditorForm = ({ scene, AddLine, sceneIndex, DeleteLine }: any) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Formik
      enableReinitialize={true}
      initialValues={scene}
      onSubmit={(values) => console.log(values)}
    >
      {({ values }) => (
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <button
            className="drag-handle"
            disabled={!isEditing}
            onClick={() => AddLine(sceneIndex)}
          >
            add
          </button>
          <button
            className="drag-handle"
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit
          </button>
          <Form>
            {values.data.map((line: any, lineIndex: number) => {
              return (
                <Drag
                  className="draggable"
                  key={line.id}
                  id={line.id}
                  index={lineIndex}
                  isDragDisabled={!isEditing}
                >
                  <fieldset
                    className="w-full my-2 flex flex-col"
                    disabled={!isEditing}
                    key={lineIndex}
                  >
                    <ConditionalField
                      key={lineIndex}
                      show={isEditing}
                      onShow={() => {}}
                      onCollapse={() => {}}
                    >
                      <Field
                        className="border border-black"
                        placeholder="select type"
                        as="select"
                        name={`data[${lineIndex}].type`}
                      >
                        <option value="INFO">Info</option>
                        <option value="ACTOR">Actor</option>
                      </Field>
                      <button
                        type="button"
                        onClick={() => DeleteLine(sceneIndex, lineIndex)}
                      >
                        delete
                      </button>
                    </ConditionalField>
                    <Field
                      className="text-center"
                      name={`data[${lineIndex}].name`}
                    />
                    <FormikTextArea
                      type={line.type}
                      lineName={line.name}
                      name={`data[${lineIndex}].lines`}
                    />
                  </fieldset>
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
