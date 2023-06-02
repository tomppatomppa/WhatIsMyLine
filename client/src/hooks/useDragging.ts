import { useEffect, useState, useRef } from 'react'

interface useDraggingProps {
  x?: number
  y?: number
}
export function useDragging({ x = 0, y = 0 }: useDraggingProps = {}) {
  const [isDragging, setIsDragging] = useState(false)
  const [pos, setPos] = useState({ x, y })
  const ref = useRef<HTMLElement>(null)

  function onMouseMove(e: MouseEvent) {
    if (!isDragging || !ref.current) return
    setPos({
      x: e.x - ref.current.offsetWidth / 2,
      y: e.y - ref.current.offsetHeight / 2,
    })
    e.stopPropagation()
    e.preventDefault()
  }

  function onMouseUp(e: MouseEvent) {
    setIsDragging(false)
    e.stopPropagation()
    e.preventDefault()
  }

  function onMouseDown(e: MouseEvent) {
    if (e.button !== 0 || !ref.current) return
    setIsDragging(true)

    setPos({
      x: e.x - ref.current.offsetWidth / 2,
      y: e.y - ref.current.offsetHeight / 2,
    })

    e.stopPropagation()
    e.preventDefault()
  }

  // When the element mounts, attach an mousedown listener
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mousedown', onMouseDown)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', onMouseDown)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [ref.current])

  // Everytime the isDragging state changes, assign or remove
  // the corresponding mousemove and mouseup handlers
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('mousemove', onMouseMove)
    } else {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [isDragging])

  return [ref, pos.x, pos.y, isDragging]
}
