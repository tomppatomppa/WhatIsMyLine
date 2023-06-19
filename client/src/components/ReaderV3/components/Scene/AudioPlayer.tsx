import { useRef, useState, useEffect } from 'react'
import Spinner from 'src/components/common/Spinner'

interface AudioPlayerProps {
  setListen: () => void
  stopListen: () => void
  files: HTMLAudioElement[]
  transcript: any
  listening: boolean
}

const AudioPlayer = ({
  files,
  setListen,
  stopListen,
  transcript,
  listening,
}: AudioPlayerProps) => {
  const timeoutRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const currentFileIndex = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playNextFile = () => {
    const audioElement = audioRef.current

    if (audioElement && currentFileIndex.current < files.length) {
      audioElement.src = files[currentFileIndex.current].src
      audioElement.play()
      currentFileIndex.current = currentFileIndex.current + 1
      setIsPlaying(true)
      stopListen()

      timeoutRef.current = null
    } else {
      currentFileIndex.current = 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const resetAudio = () => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      currentFileIndex.current = 0
    }
  }

  const togglePlayback = () => {
    const audioElement = audioRef.current
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play()
        setIsPlaying(true)
      }
    }
  }

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    if (!isPlaying && listening) {
      timeoutRef.current = setTimeout(() => {
        playNextFile()
      }, 1500)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript])

  return (
    <div className="flex gap-2 items-center">
      <label>{currentFileIndex.current}</label>
      <Spinner show={listening} />
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false)
          setListen()
        }}
      />
      <button type="button" onClick={playNextFile}>
        {currentFileIndex.current === 0 ? 'Play' : 'Next'}
      </button>
      <button type="button" onClick={togglePlayback}>
        {isPlaying ? 'Pause' : 'Resume'}
      </button>
      <button onClick={resetAudio}>reset</button>
    </div>
  )
}

export default AudioPlayer
