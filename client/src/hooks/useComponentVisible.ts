import { useState, useEffect, useRef } from 'react'

export interface UseComponentVisibleResult {
  ref: React.RefObject<HTMLElement>
  isComponentVisible: boolean
  setIsComponentVisible: (visible: boolean) => void
}
export default function useComponentVisible(
  initialIsVisible: boolean
): UseComponentVisibleResult {
  const [isComponentVisible, setIsComponentVisible] =
    useState<boolean>(initialIsVisible)
  const ref = useRef<HTMLElement | null>(null)

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLDivElement
    if (ref.current && !ref.current.contains(target)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return { ref, isComponentVisible, setIsComponentVisible }
}
