import clsx from 'clsx'
import styles from '../Reader.module.css'
import { useReaderContext } from '../contexts/ReaderContext'

type AlertHeadingProps = {
  className?: string
  children?: React.ReactNode
}

const ReaderHeading = (props: AlertHeadingProps) => {
  const { className } = props
  const { script } = useReaderContext()

  return (
    <div className={clsx(styles.alertHeader, className)}>{script.filename}</div>
  )
}
export default ReaderHeading
