import React from 'react'

interface AudioPlayerProps {
  audioFiles: any[]
}
const AudioPlayer = ({ audioFiles }: AudioPlayerProps) => {
  return (
    <div>
      {audioFiles.map((file, index) => (
        <audio key={index} controls>
          <source src={file.id} type={file.mimeType} />
        </audio>
      ))}
    </div>
  )
}

export default AudioPlayer
