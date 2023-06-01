import { Formik, Field, FieldArray, Form } from 'formik'
import { ReaderConfiguration, Scene } from '../reader.types'
import { getLineStyle } from '../utils'
import clsx from 'clsx'
import FormikTextArea from './FormikTextArea'
import { useEffect, useState } from 'react'
import ReaderMenuButton from './ReaderMenuButton'
import ConfirmIcon from './icons/ConfirmIcon'
import CancelIcon from './icons/CancelIcon'
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

  //Force form to update
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
                    <div key={index} className="my-2 flex flex-col">
                      <Field
                        onClick={() => props.handleHighlight(name)}
                        style={getLineStyle(type, options)}
                        className={clsx(`font-bold cursor-pointer`)}
                        name={`data[${index}].name`}
                        value={name}
                      />
                      <FormikTextArea
                        style={getLineStyle(type, options, name)}
                        type={type}
                        label="lines"
                        id="text-area"
                        name={`data[${index}].lines`}
                        value={lines}
                      />
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
