import Select from 'react-select'
import useCurrentScripts from '../hooks/useCurrentScripts'

const SelectScene = ({ menuItems }) => {
  const { setShowScenes } = useCurrentScripts()

  const handleChange = (selectedOption) => {
    if (!selectedOption) {
      setShowScenes([])
      return
    }
    setShowScenes([selectedOption.value])
  }

  return (
    <Select
      className="w-72 self-center mr-4"
      options={menuItems}
      isClearable
      onChange={handleChange}
    />
  )
}

export default SelectScene
