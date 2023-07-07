import { useEffect } from 'react'

interface ConditionalFieldProps {
  show: boolean
  onCollapse: () => void
  onShow: () => void
  children: React.ReactNode
}
export const ConditionalField = ({
  show,
  onCollapse,
  onShow,
  children,
}: ConditionalFieldProps) => {
  useEffect(() => {
    if (show) {
      onShow()
    } else {
      onCollapse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return show ? children : null
}
