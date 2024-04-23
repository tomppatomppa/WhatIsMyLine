import { useField } from 'formik'
import { SceneLine } from '../../reader.types'
import { useRef, useEffect } from 'react'

interface FormikTextAreaProps {
  type: SceneLine
  name: string
  props?: FormikTextAreaProps
  lineName: string
  disabled?: boolean
  style?: object
}
export const FormikTextArea = ({
  lineName,
  disabled,
  style = {},
  ...props
}: FormikTextAreaProps) => {
  const [field, meta] = useField(props.name)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /**Resize textarea to content **/
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [field.value])

  return (
    <>
      <label htmlFor={field.name} />
      <textarea
        ref={textareaRef}
        disabled={disabled}
        className="text-area"
        style={{ ...style }}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="error bg-red-200">{meta.error}</div>
      ) : null}
    </>
  )
}
