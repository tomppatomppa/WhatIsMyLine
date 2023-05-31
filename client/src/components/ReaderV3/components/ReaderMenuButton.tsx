import clsx from 'clsx'

interface ReaderMenuButtonProps {
  className?: string
  show: boolean
  text?: string
  icon?: JSX.Element
  onClick: () => void
}
const ReaderMenuButton = (props: ReaderMenuButtonProps) => {
  const { text, show, icon = null, onClick } = props
  return show ? (
    <button className={clsx(props.className)} onClick={onClick}>
      {text}
      {icon}
    </button>
  ) : null
}

export default ReaderMenuButton
