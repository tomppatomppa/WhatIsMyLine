import { useField } from 'formik'
import { useReaderContext } from '../contexts/ReaderContext'
import { SceneLine, Style } from '../reader.types'
import { useRef, useEffect } from 'react'

interface FormikTextAreaProps {
  label: string
  id: string
  type: SceneLine
  name: string
  props?: FormikTextAreaProps
  value: string[]
  style: Style
}
const FormikTextArea = ({ label, style, ...props }: FormikTextAreaProps) => {
  const [field, meta] = useField(props)
  const { options } = useReaderContext()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [field.value])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.backgroundColor =
        options.highlight?.[0]?.style?.backgroundColor || '#fff'
    }
  }, [options.highlight, style.color])

  return (
    <>
      <label htmlFor={props.id || field.name}></label>
      <textarea
        ref={textareaRef}
        className="text-area"
        style={style as any}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  )
}

export default FormikTextArea
