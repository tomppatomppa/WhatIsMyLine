import { useEffect } from 'react'

interface ConditionalFieldProps {
  show: boolean
  onCollapse: () => void
  onShow: () => void
  reason?: string
  children: React.ReactNode
}
export const ConditionalField = ({
  show,
  onCollapse,
  onShow,
  reason,
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

  return show ? (
    children
  ) : reason ? (
    <label className="text-red-900">{reason}</label>
  ) : null
}
