import { useRef, useState, useEffect, useCallback } from 'react'
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

  const playNextFile = useCallback(() => {
    const audioElement = audioRef.current

    if (audioElement && currentFileIndex.current < files.length) {
      audioElement.src = files[currentFileIndex.current].src
      audioElement.play()
      currentFileIndex.current = currentFileIndex.current + 1
      setIsPlaying(true)
      stopListen()

      timeoutRef.current = null
    }
  }, [])

  const pausePlayback = () => {
    const audioElement = audioRef.current

    if (audioElement && isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    }
  }

  const resumePlayback = () => {
    const audioElement = audioRef.current

    if (audioElement && !isPlaying) {
      audioElement.play()
      setIsPlaying(true)
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
  }, [playNextFile, transcript])

  return (
    <div className="flex gap-2">
      {isPlaying ? (
        <div className="absolute flex justify-center items-center inset-0 h">
          <label> Modal</label>
        </div>
      ) : (
        <div className="flex items-center">
          <label>listening...</label>
          <Spinner show />
        </div>
      )}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false)
          setListen()
        }}
      />
      <button type="button" onClick={playNextFile}>
        Play
      </button>
      <button type="button" onClick={pausePlayback}>
        Pause
      </button>
      <button type="button" onClick={resumePlayback}>
        Resume
      </button>
      <button
        type="button"
        onClick={() => {
          currentFileIndex.current = 0
        }}
      >
        Reset
      </button>
    </div>
  )
}

export default AudioPlayer
