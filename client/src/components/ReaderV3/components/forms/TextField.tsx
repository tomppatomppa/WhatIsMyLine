// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormField } from './FormField'

export const TextField = ({
  label,
  field: { name, value, ...fieldProps },
  form,
  required,
  ...props
}) => {
  return (
    <FormField id={name} label={label} required={required} formProps={form}>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        {...fieldProps}
        {...props}
      />
    </FormField>
  )
}
