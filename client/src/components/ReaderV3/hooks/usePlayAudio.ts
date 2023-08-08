import { MutableRefObject, useState, useRef } from 'react'

interface UsePlayAudioReturn {
  controls: {
    play: () => void
    pause: () => void
    reset: () => void
    stopAll: () => void
  }
  setCurrentAudio: (audio: HTMLAudioElement | null) => void
  audioRef: MutableRefObject<HTMLAudioElement | null>
}

const usePlayAudio = (
  onEnded: (audio: HTMLAudioElement | null) => void
): UsePlayAudioReturn => {
  const [autoPlay] = useState(true)

  const audioRef: MutableRefObject<HTMLAudioElement | null> =
    useRef<HTMLAudioElement | null>(null)

  const play = () => {
    if (audioRef.current) {
      const endedListener = () => {
        audioRef.current?.pause()
        audioRef.current?.removeEventListener('ended', endedListener)
        onEnded(audioRef.current)
      }
      audioRef.current.addEventListener('ended', endedListener)
      audioRef.current.play()
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const reset = () => {
    if (audioRef.current) {
      pause()
      audioRef.current.currentTime = 0
    }
  }

  const stopAll = () => {
    if (audioRef.current) {
      reset()
      audioRef.current.removeEventListener('ended', () => {})
      audioRef.current = null
    }
  }
  const setCurrentAudio = (audio: HTMLAudioElement | null) => {
    stopAll()
    audioRef.current = audio?.src ? audio : null

    if (autoPlay) play()
  }

  const controls = {
    play,
    pause,
    reset,
    stopAll,
  }

  return { controls, setCurrentAudio, audioRef }
}

export default usePlayAudio
