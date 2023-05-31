import { Formik, Field, FieldArray, Form } from 'formik'
import { ReaderConfiguration, Scene } from '../reader.types'
import { useState } from 'react'
import { getLineStyle } from '../utils'
import clsx from 'clsx'

interface EditableSceneItemProps {
  scene: Scene
  isEditing: boolean
  handleHighlight: (value: string) => void
  handleSave: (scene: Scene) => void
  setIsEditing: (value: boolean) => void
  options: ReaderConfiguration
  children?: React.ReactNode
}

const EditableSceneItem = (props: EditableSceneItemProps) => {
  const { scene, isEditing, options, handleSave } = props

  return (
    <Formik
      onSubmit={handleSave}
      initialValues={scene}
      enableReinitialize={true}
    >
      {({ values, resetForm }) => (
        <FieldArray name="data">
          {({ move, swap, push, insert, unshift, pop, form, remove }) => {
            return (
              <Form className="flex flex-col">
                <EditMenu {...props} resetForm={resetForm} />
                <fieldset disabled={!isEditing}>
                  {values.data.map(({ name, type, lines }, index) => (
                    <div key={index} className="my-2">
                      <Field
                        style={getLineStyle(type, options)}
                        className={clsx(
                          `hover:cursor-pointer font-bold ${
                            !name ? 'hidden' : ''
                          }`
                        )}
                        name={`data[${index}].name`}
                        value={name}
                      />
                      <FieldArray name={`data[${index}].lines`}>
                        {({ push, remove }) => (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                push('New Line')
                              }}
                              className="w-6 text-green-600 border-black border rounded-md"
                            >
                              +
                            </button>
                            {lines.map((line, lineIndex) => (
                              <div
                                className="flex"
                                key={lineIndex}
                                onMouseDown={() =>
                                  console.log(index, lineIndex)
                                }
                              >
                                <Field
                                  style={getLineStyle(type, options)}
                                  className="mx-auto w-full"
                                  name={`data[${index}].lines[${lineIndex}]`}
                                  value={line}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    remove(lineIndex)
                                  }}
                                  className="w-6 text-red-900"
                                >
                                  del
                                </button>
                              </div>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    </div>
                  ))}
                </fieldset>
              </Form>
            )
          }}
        </FieldArray>
      )}
    </Formik>
  )
}
const EditMenu = (props: any) => {
  const { isEditing, setIsEditing } = props

  return (
    <div className="flex justify-end">
      {isEditing && (
        <div>
          <button type="submit">save</button>
          <button type="reset" onClick={() => setIsEditing(false)}>
            cancel
          </button>
        </div>
      )}
    </div>
  )
}
export default EditableSceneItem
