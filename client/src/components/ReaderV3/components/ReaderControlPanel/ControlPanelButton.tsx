import clsx from 'clsx'
import useComponentVisible from 'src/hooks/useComponentVisible'
import styles from '../../Reader.module.css'

export const ControlPanelButton = ({ icon, children, onClick }: any) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  const handleOnClick = () => {
    if (!onClick) {
      setIsComponentVisible(true)
      return
    }
    onClick()
  }
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={() => handleOnClick()}
      className={clsx(
        styles['menubar'],
        'menubar-icon transition-all duration-200'
      )}
    >
      {icon}
      {children && (
        <span
          className={clsx(
            styles['tooltip'],
            `transition-all duration-200 ${
              isComponentVisible ? 'scale-100' : 'scale-0'
            }`
          )}
        >
          <div className="flex flex-col items-start gap-y-2">{children}</div>
        </span>
      )}
    </div>
  )
}
