//@ts-nocheck
import { arrayBufferResponse } from 'src/API/googleApi'
import { Actor, ReaderConfiguration, Scene } from './reader.types'

export function generateUniqueColor(highlight: Actor[]) {
  const colors = [
    '#86efac',
    '#d8b4fe',
    '#f7d8a1',
    '#e6d5c1',
    '#d6d2e0',
    '#c6cfeb',
    '#b5ccf8',
    '#a5c9f3',
    '#94c5ed',
    '#84c2e8',
    '#74bedf',
    '#64bbda',
  ]

  const excludedColors = highlight.map((item) => {
    return item.style.backgroundColor
  })

  for (const element of colors) {
    if (!excludedColors.includes(element)) {
      return element
    }
  }
  return '#86efac'
}

/* 
Used to check if google drive folder has
 all required audio files for a scene
*/
export function hasRequiredAudioFiles(arr1: any[], arr2: any[]): boolean {
  const requiredFileIds = arr1.map((item) => item.id)
  const allFolderFileIds = arr2.map((item) => item.id)
  for (let i = 0; i < arr1.length; i++) {
    if (!allFolderFileIds.includes(requiredFileIds[i])) {
      return false
    }
  }

  return true
}

export function arrayBufferIntoHTMLAudioElement(
  audioArray: arrayBufferResponse[]
): HTMLAudioElement[] {
  const result = audioArray.map((file) => {
    const fileUrl = URL.createObjectURL(
      new Blob([file.data], { type: 'audio/mpeg' })
    )
    const audio = new Audio(fileUrl)

    audio.key = file.id
    return audio
  })
  return result
}

interface Audio extends HTMLAudioElement {
  key: string
}
export function filterAudioFiles(
  values: Scene,
  audioFiles: HTMLAudioElement[] | undefined,
  options: ReaderConfiguration
): HTMLAudioElement[] {
  if (!audioFiles) return []

  const filteredLines: Line[] = values.data.filter(
    ({ name }) =>
      !options.highlight.some((highlight: Line) => highlight.id === name)
  )

  const filteredAudio = filteredLines.map((line) => {
    const audio = audioFiles?.find(
      (item) => (item as Audio).key === line.id
    ) as Audio
    return audio
  })
  return filteredAudio
}
