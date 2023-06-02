import { useEffect, useState } from 'react'
import './style.css'

function useDelayUnmount(isMounted, delayTime) {
  const [showDiv, setShowDiv] = useState(false)
  useEffect(() => {
    let timeoutId
    if (isMounted && !showDiv) {
      setShowDiv(true)
    } else if (!isMounted && showDiv) {
      timeoutId = setTimeout(() => setShowDiv(false), delayTime) //delay our unmount
    }
    return () => clearTimeout(timeoutId) // cleanup mechanism for effects , the use of setTimeout generate a sideEffect
  }, [isMounted, delayTime, showDiv])
  return showDiv
}

const DelayWrapper = ({ children, isMounted }) => {
  const showDiv = useDelayUnmount(isMounted, 300)
  const mountedStyle = { animation: 'inAnimation 300ms ease-in' }
  const unmountedStyle = {
    animation: 'outAnimation 320ms ease-out',
    animationFillMode: 'forwards',
  }
  return (
    <div>
      {showDiv && (
        <div style={isMounted ? mountedStyle : unmountedStyle}>{children}</div>
      )}
    </div>
  )
}

export default DelayWrapper
