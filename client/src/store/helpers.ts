import { Scene, Script } from 'src/components/ReaderV3/reader.types'

export const getCurrentScript = (
  scripts: Script[],
  activeScriptFilename: string
): Script | undefined =>
  scripts.find(({ filename }) => filename === activeScriptFilename)

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const swapScenes = (
  scene: any[],
  sceneId: number,
  destinationId: number
): Scene[] => {
  return reorder(scene, sceneId, destinationId)
}

export const swapLines = (
  scene: Scene,
  lineId: number,
  destinationId: number
): Scene => {
  const updatedOrder = reorder(scene.data, lineId, destinationId)

  return { ...scene, data: updatedOrder }
}
