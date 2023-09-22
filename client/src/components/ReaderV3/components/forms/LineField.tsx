import { Field } from 'formik'

interface FieldProps {
  id: string
  style: string
  disabled: boolean
  name: string
  scrollToElementId: string
}

const LineField = ({
  id,
  style,
  disabled,
  name,
  scrollToElementId,
}: FieldProps) => {
  const elementToScrollTo = document.getElementById(scrollToElementId)

  if (elementToScrollTo) {
    elementToScrollTo.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }

  return <Field id={id} style={style} disabled={disabled} name={name} />
}

export default LineField
