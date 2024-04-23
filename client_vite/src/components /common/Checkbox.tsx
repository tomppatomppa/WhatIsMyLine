import React from 'react'

interface CheckboxProps {
  checked: boolean
  label?: string
  onChange: () => void
}

const Checkbox = ({ checked, label, onChange }: CheckboxProps) => {
  return (
    <label className="flex text-xs" htmlFor="filter">
      {label}
      <input
        name="filter"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  )
}

export default Checkbox
