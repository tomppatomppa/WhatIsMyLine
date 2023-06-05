import { Fragment, useState } from 'react'
import { Field, FieldArray, Form, Formik } from 'formik'
import FormikTextArea from './FormikTextArea'

interface SceneEditorProps {
  scene: any
}
const SceneEditorInteractive = ({ scene, ...props }: SceneEditorProps) => {
  const [formKey, setFormKey] = useState(0)

  return (
    <Formik
      key={formKey}
      onSubmit={(values) => console.log('Save', values)}
      initialValues={scene}
    >
      {({ values: { data } }) => (
        <FieldArray name="data">
          {({ insert, form }) => (
            <Form autoComplete="off" className="flex flex-col text-center">
              <Field name="id" type="text" />
              {data.map(({ id, name, type }: any, index: number) => (
                <Fragment key={index}>
                  <Field
                    onClick={() => {}}
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
  )
}

export default SceneEditorInteractive
