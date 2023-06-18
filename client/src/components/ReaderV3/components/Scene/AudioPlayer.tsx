import React, { useRef } from 'react'

interface AudioPlayerProps {
  files: HTMLAudioElement[]
}
const AudioPlayer = ({ files }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const currentFileIndex = useRef<number>(0)
  const isPlaying = useRef<boolean>(false)

  const playNextFile = () => {
    const audioElement = audioRef.current

    if (audioElement && currentFileIndex.current < files.length) {
      audioElement.src = files[currentFileIndex.current].src
      audioElement.play()
      currentFileIndex.current++
      isPlaying.current = true
    }
  }

  const pausePlayback = () => {
    const audioElement = audioRef.current

    if (audioElement && isPlaying.current) {
      audioElement.pause()
      isPlaying.current = false
    }
  }

  const resumePlayback = () => {
    const audioElement = audioRef.current

    if (audioElement && !isPlaying.current) {
      audioElement.play()
      isPlaying.current = true
    }
  }

  return (
    <div className="flex gap-2">
      <audio ref={audioRef} onEnded={playNextFile} />
      <button type="button" onClick={playNextFile}>
        Play
      </button>
      <button type="button" onClick={pausePlayback}>
        Pause
      </button>
      <button type="button" onClick={resumePlayback}>
        Resume
      </button>
      <button type="button" onClick={() => currentFileIndex.current === 0}>
        Reset
      </button>
    </div>
  )
}

export default AudioPlayer
