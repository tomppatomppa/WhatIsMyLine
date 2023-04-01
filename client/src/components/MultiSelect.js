import React from 'react'
import Select from 'react-select'
import useCurrentScripts from '../hooks/useCurrentScripts'

const MultiSelect = ({ menuItems }) => {
  const { setShowScenes } = useCurrentScripts()
  const handleChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption)
    setShowScenes([selectedOption.value])
  }

  return (
    <Select
      className="w-72 self-center mr-4"
      options={menuItems}
      onChange={handleChange}
    />
  )
}

export default MultiSelect
