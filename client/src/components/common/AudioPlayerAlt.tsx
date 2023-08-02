import React, { useRef, useState, useEffect } from 'react'
import { PlayIcon } from '../ReaderV3/components/icons'
import { Audio } from '../ReaderV3/utils'

interface AudioPlayerProps {
  active: boolean
  setListen: () => void
  stopListen: () => void
  files: HTMLAudioElement
  transcript: any
  listening: boolean
}

const AudioPlayerAlt = ({ files, setListen, active }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      // Pause any existing audio and clear the src before loading the new source
      audioElement.pause()
      audioElement.src = ''

      // Set the new audio source
      audioElement.src = files.src
      audioElement.load()
      // Add an event listener for the canplaythrough event
    }
  }, [files])

  return files ? (
    <div className="flex gap-2 items-center">
      <audio
        controls
        autoPlay
        ref={audioRef}
        onEnded={() => {
          setListen()
          console.log('ended')
        }}
      />
    </div>
  ) : null
}

export default AudioPlayerAlt
