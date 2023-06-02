interface MinimizeButtonProps {
  onClick: () => void
}
export const MinimizeButton = (props: MinimizeButtonProps) => {
  return (
    <span
      onClick={props.onClick}
      className={`hover:scale-100 scale-50 absolute -right-2 -top-2 w-6 h-6 bg-indigo-400 hover:bg-indigo-500 rounded-full translate-all duration-200`}
    />
  )
}
