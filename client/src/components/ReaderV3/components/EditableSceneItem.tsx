import { Formik, Field, FieldArray, Form } from 'formik'
import { ReaderConfiguration, Scene } from '../reader.types'
import { getLineStyle } from '../utils'
import clsx from 'clsx'
import FormikTextArea from './FormikTextArea'
import { useEffect, useState } from 'react'
import ReaderMenuButton from './ReaderMenuButton'
import ConfirmIcon from './icons/ConfirmIcon'
import CancelIcon from './icons/CancelIcon'
import DeleteIcon from './icons/DeleteIcon'
import PlusIcon from './icons/PlusIcon'
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
  const [formKey, setFormKey] = useState(0)

  /**
   * Force form to rerender by updating key
   */
  useEffect(() => {
    setFormKey((prev) => prev + 1)
  }, [isEditing])

  return (
    <Formik onSubmit={handleSave} initialValues={scene}>
      {({ values, resetForm }) => (
        <FieldArray key={formKey} name="data">
          {({ move, swap, push, insert, unshift, pop, form, remove }) => {
            return (
              <Form className="flex flex-col">
                <EditMenu {...props} resetForm={resetForm} />
                <fieldset disabled={!isEditing}>
                  {values.data.map(({ name, type, lines }, index) => (
                    <div key={index}>
                      {isEditing && (
                        <label
                          onClick={() =>
                            insert(index, {
                              type: 'ACTOR',
                              name: 'Add name',
                              lines: 'New Line',
                            })
                          }
                          className="focus:bg-red-200 cursor-crosshair hover:animate-pulse flex mx-auto w-6 justify-center items-center "
                        >
                          <PlusIcon />
                        </label>
                      )}
                      <div
                        className={clsx(
                          `my-2 flex flex-col ${
                            isEditing && 'border-orange-400 border'
                          } relative`
                        )}
                      >
                        <Field
                          onClick={() => {
                            if (!isEditing) props.handleHighlight(name)
                          }}
                          style={getLineStyle(type, options)}
                          className={clsx(`font-bold cursor-pointer`)}
                          name={`data[${index}].name`}
                          value={name || ''}
                        />
                        <FormikTextArea
                          style={getLineStyle(type, options, name)}
                          type={type}
                          label="lines"
                          id="text-area"
                          name={`data[${index}].lines`}
                          value={lines}
                        />
                        {isEditing && (
                          <>
                            <label
                              onClick={() => remove(index)}
                              className="absolute  w-6 right-0 top-0"
                            >
                              <DeleteIcon />
                            </label>
                          </>
                        )}
                      </div>
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
    <div className="flex justify-end relative -top-6">
      {isEditing && (
        <div className="flex gap-4">
          <ReaderMenuButton
            className="hover:scale-110"
            show
            type="submit"
            icon={<ConfirmIcon />}
          />
          <ReaderMenuButton
            show
            type="reset"
            onClick={() => setIsEditing(false)}
            icon={<CancelIcon />}
          />
        </div>
      )}
    </div>
  )
}
export default EditableSceneItem
