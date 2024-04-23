import Checkbox from './common/Checkbox'

export type SelectLabel = {
  label: string
  value: string
}

interface SelectListProps {
  labels: SelectLabel[]
  initialValues: string[]
  checkbox?: boolean
  onCheck: (value: string) => void
}

const SelectList = ({
  labels,
  initialValues,
  onCheck,
  checkbox = true,
}: SelectListProps) => {
  return (
    <ul className="text-gray-700 flex flex-col mt-2">
      {labels.map((value: SelectLabel, index: number) => {
        return (
          <li key={index} className="text-black flex justify-end">
            <label className="flex-1 mr-2">{value.label}</label>
            {checkbox ? (
              <Checkbox
                checked={initialValues.includes(value.value)}
                onChange={() => onCheck(value.value)}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

export default SelectList
