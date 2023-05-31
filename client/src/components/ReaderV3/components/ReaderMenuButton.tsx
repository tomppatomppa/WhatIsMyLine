import clsx from 'clsx'

type Variant = 'cancel' | 'confirm'
interface ReaderMenuButtonProps {
  variant?: Variant
  className?: string
  show: boolean
  text?: string
  icon?: JSX.Element
  onClick: () => void
}

const VARIANT = {
  normal: 'text-black',
  cancel: 'text-red-900',
  confirm: 'bg-emerald-300 text-black',
}
const ReaderMenuButton = (props: ReaderMenuButtonProps) => {
  const { text, show, icon = null, onClick, variant = 'normal' } = props
  return show ? (
    <button
      className={clsx(props.className, VARIANT[variant])}
      onClick={onClick}
    >
      {text}
      {icon}
    </button>
  ) : null
}

export default ReaderMenuButton
