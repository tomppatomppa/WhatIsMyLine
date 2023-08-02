import React from 'react'

interface CheckboxProps {
  label?: string
  defaultChecked?: boolean
  onChange: (checked: boolean) => void
}

const Checkbox = ({
  label,
  onChange,
  defaultChecked = false,
}: CheckboxProps) => {
  const [checked, setChecked] = React.useState(defaultChecked)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    onChange(event.target.checked)
  }

  return (
    <label className="flex text-xs" htmlFor="filter">
      {label}
      <input
        name="filter"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
    </label>
  )
}

export default Checkbox
