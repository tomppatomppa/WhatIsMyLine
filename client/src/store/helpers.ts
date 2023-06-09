import { Scene, Script } from "src/components/ReaderV3/reader.types";

export const getCurrentScript = (scripts: Script[], activeScriptFilename: string): Script | undefined => 
    scripts.find(({filename}) => filename === activeScriptFilename)


export const swapScenes = (scenes: Scene[], sceneId: number, destinationId: number): Scene[] => {
    const newScenes = [...scenes]
    newScenes.splice(sceneId, 1)
    newScenes.splice(destinationId, 0, scenes[sceneId])
    return newScenes
  }
      