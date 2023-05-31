import clsx from 'clsx'
import styles from '../Reader.module.css'
import { useReaderContext } from '../contexts/ReaderContext'

type AlertHeadingProps = {
  className?: string
}

const ReaderHeading = (props: AlertHeadingProps) => {
  const { className } = props
  const { script } = useReaderContext()
  console.log(script)
  return (
    <div className={clsx(styles.alertHeader, className)}>
      {script?.filename}
    </div>
  )
}
export default ReaderHeading
