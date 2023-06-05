// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const FormField = ({
  id,
  label,
  required,
  children,
  formProps: { touched, errors },
}: any) => {
  const hasError = errors[id] && touched[id]

  return (
    <div className="field" id={id} label={label}>
      <label htmlFor={id}>
        {label}
        {required && <sup className="required">*</sup>}
      </label>
      {children}
      {hasError && <small className="error">{errors[id]}</small>}
    </div>
  )
}
