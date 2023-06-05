import clsx from 'clsx'
import React, { Fragment, useEffect, useState } from 'react'
import styles from '../../Reader.module.css'
import { Field, FieldArray, Form, Formik } from 'formik'
import { Scene } from '../../reader.types'
import { CancelIcon, EditIcon } from '../icons'
import FormikTextArea from './FormikTextArea'

interface SceneEditorProps {
  scene: Scene
  isEditing: boolean
  isExpanded: boolean
  setIsEditing: (value: boolean) => void
  handleHighlight: (value: string) => void
  children?: React.ReactNode
}
const SceneEditor = (props: SceneEditorProps) => {
  const [formKey, setFormKey] = useState(0)
  const { isEditing, isExpanded, scene, handleHighlight } = props

  /**
   * Force FieldArray to rerender whenever isEditing,
   * or isExpanded prop changes
   */
  useEffect(() => {
    setFormKey((prev) => prev + 1)
  }, [isEditing, isExpanded])
  console.log(scene)
  return (
    <div className={clsx(styles['scene-editor'])}>
      <Formik
        key={formKey}
        onSubmit={(values) => console.log('Save', values)}
        initialValues={scene}
      >
        {({ values: { data } }) => (
          <FieldArray name="data">
            {({ insert, form }) => (
              <Form autoComplete="off" className="flex flex-col text-center">
                {/* <SceneEditorPanel {...props} /> */}
                {/* <Field name="id" type="text" /> */}
                {data.map(({ name, type }, index) => (
                  <Fragment key={index}>
                    <Field
                      onClick={() => handleHighlight(name)}
                      className="text-center font-bold mt-4"
                      name={`data[${index}].name`}
                    />
                    <FormikTextArea
                      lineName={name}
                      type={type}
                      name={`data[${index}].lines`}
                    />
                  </Fragment>
                ))}
              </Form>
            )}
          </FieldArray>
        )}
      </Formik>
    </div>
  )
}

const SceneEditorPanel = (props: SceneEditorProps) => {
  const { isEditing, setIsEditing } = props
  return (
    <div className="flex justify-end">
      <button type="submit">Save</button>
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? <CancelIcon /> : <EditIcon />}
      </button>
    </div>
  )
}
export default SceneEditor
