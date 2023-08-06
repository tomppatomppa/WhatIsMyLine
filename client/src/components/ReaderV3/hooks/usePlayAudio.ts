import { MutableRefObject, useState, useRef } from 'react'
interface UsePlayAudioReturn {
  controls: {
    play: () => void
    pause: () => void
    reset: () => void
  }
  setCurrentAudio: (audio: HTMLAudioElement | null) => void
  audioRef: MutableRefObject<HTMLAudioElement | null>
}

const usePlayAudio = (): UsePlayAudioReturn => {
  const [autoPlay, setAutoPlay] = useState(true)
  const audioRef: MutableRefObject<HTMLAudioElement | null> =
    useRef<HTMLAudioElement | null>(null)

  const play = () => {
    if (audioRef.current) {
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
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const setCurrentAudio = (audio: HTMLAudioElement | null) => {
    audioRef.current = audio?.src ? audio : null
    if (autoPlay) play()
  }

  const controls = {
    play,
    pause,
    reset,
  }

  return { controls, setCurrentAudio, audioRef }
}

export default usePlayAudio
