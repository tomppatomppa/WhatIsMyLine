import { useRef, useEffect } from 'react'

interface AudioPlayerProps {
  setListen: () => void
  stopListen: () => void
  files?: HTMLAudioElement | undefined | null
  transcript: any
  active: boolean
}

const AudioPlayerAlt = ({
  files,
  setListen,
  stopListen,
  active,
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audioElement = audioRef.current

    if (audioElement && active) {
      audioElement.pause()
      audioElement.src = ''
    }

    if (audioElement && files) {
      audioElement.pause()
      audioElement.src = ''

      // Set the new audio source
      audioElement.src = files.src
      audioElement.load()
    }
  }, [files, active])

  return files ? (
    <div className="flex gap-2 items-center">
      <audio
        autoPlay
        ref={audioRef}
        onEnded={setListen}
        onPlay={() => stopListen()}
      />
    </div>
  ) : null
}

export default AudioPlayerAlt
