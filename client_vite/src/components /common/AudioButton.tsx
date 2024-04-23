interface AudioButtonProps {
  text: string
  show?: boolean
  onClick: () => void
}
export const AudioButton = ({
  text,
  show = true,
  onClick,
}: AudioButtonProps) => {
  return show ? (
    <button type="button" onClick={onClick}>
      {text}
    </button>
  ) : null
}
