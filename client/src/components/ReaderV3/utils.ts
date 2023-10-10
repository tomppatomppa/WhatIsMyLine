import { CustomHTMLAudioElement } from 'src/utils/helpers'
import { Actor, Line, ReaderConfiguration, Scene } from './reader.types'

const DEFAULT_HIGHLIGHT_COLOR = '#86efac'

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
  return DEFAULT_HIGHLIGHT_COLOR
}

export function filterLines(
  values: Scene,
  options: ReaderConfiguration
): Line[] {
  return values.data.filter(
    ({ name }) =>
      !options.highlight.some((highlight: Actor) => highlight.id === name)
  )
}

export function labelLines(
  values: Scene,
  options: ReaderConfiguration,
  audioFiles: HTMLAudioElement[] | undefined
) {
  return values.data.map((line) => {
    return {
      ...line,
      shouldPlay: !options.highlight.some(
        (highlight: Actor) => highlight.id === line.name
      ),
      src: audioFiles?.find(
        (audio) => (audio as CustomHTMLAudioElement).key === line.id
      ),
    }
  })
}

export function filterAudioFiles(
  values: Scene,
  audioFiles: HTMLAudioElement[] | undefined,
  options: ReaderConfiguration
): HTMLAudioElement[] {
  if (!audioFiles) return []

  const filteredLines: Line[] = filterLines(values, options)

  const filteredAudio = filteredLines.map((line) => {
    const audio = audioFiles?.find(
      (item) => (item as CustomHTMLAudioElement).key === line.id
    ) as CustomHTMLAudioElement
    return audio
  })
  return filteredAudio
}
