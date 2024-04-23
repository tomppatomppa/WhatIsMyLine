import { Line } from '../../reader.types'

export function ScrollCommandBuilder(
  lines: Line[],
  action: (currentScrollTarget: string) => void
) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: () => action(line.id),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.4,
    bestMatchOnly: true,
  }))
}
