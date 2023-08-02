import Checkbox from './common/Checkbox'

interface SelectListProps {
  labels: string[]
  checkbox?: boolean
}

const SelectList = ({ labels, checkbox = true }: SelectListProps) => {
  return (
    <ul className="text-gray-700 flex flex-col mt-2">
      {labels.map((label: string, index: number) => {
        return (
          <li key={index} className="text-black flex justify-end">
            <label className="flex-1">{label}</label>
            {checkbox && (
              <Checkbox
                onChange={(value) => {
                  console.log(value)
                }}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default SelectList
