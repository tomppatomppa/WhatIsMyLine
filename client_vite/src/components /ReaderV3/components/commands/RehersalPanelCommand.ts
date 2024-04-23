import { SceneLine } from '../../reader.types'

interface LabeledLine {
  type: SceneLine
  name: string
  id: string
  lines: string
  src: HTMLAudioElement
  shouldPlay: boolean
}

export function handleNextAction(labeled: LabeledLine) {
  if (!labeled || !labeled.shouldPlay) return undefined
  return labeled
}

export function RehearsalCommandBuilder(
  lines: LabeledLine[],
  action: (nextLine: LabeledLine | undefined) => void
) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: () => action(handleNextAction(lines[index + 1])),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.5,
    bestMatchOnly: true,
  }))
}
