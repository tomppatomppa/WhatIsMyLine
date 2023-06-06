import { useField } from 'formik'
import { useReaderContext } from '../../contexts/ReaderContext'
import { Actor, SceneLine } from '../../reader.types'
import { useRef, useEffect } from 'react'
import { getLineStyle } from '../../utils'

interface FormikTextAreaProps {
  type: SceneLine
  name: string
  props?: FormikTextAreaProps
  lineName: string
  disabled?: boolean
}
export const FormikTextArea = ({
  lineName,
  disabled,
  ...props
}: FormikTextAreaProps) => {
  const [field, meta] = useField(props.name)
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
      const actor: Actor | undefined = options?.highlight?.find(
        (item: Actor) => item.id === lineName
      )
      textareaRef.current.style.backgroundColor = actor
        ? actor.style.backgroundColor
        : '#fff'
    }
  }, [lineName, options?.highlight])

  return (
    <>
      <label htmlFor={field.name} />
      <textarea
        disabled={disabled}
        ref={textareaRef}
        className="text-area"
        style={getLineStyle(props.type, options, lineName) as any}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="error bg-red">{meta.error}</div>
      ) : null}
    </>
  )
}
