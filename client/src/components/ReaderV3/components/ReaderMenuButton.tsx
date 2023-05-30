interface ReaderMenuButtonProps {
  show: boolean
  text?: string
  icon?: JSX.Element
  onClick: () => void
}
const ReaderMenuButton = (props: ReaderMenuButtonProps) => {
  const { text, show, icon = null, onClick } = props
  return show ? (
    <button onClick={onClick}>
      {text}
      {icon}
    </button>
  ) : null
}

export default ReaderMenuButton
