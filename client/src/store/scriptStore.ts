import {  Scene, Script } from 'src/components/ReaderV3/reader.types'
import {  create } from 'zustand'

export const swapScenes = (scenes: Scene[], sceneId: number, destinationId: number): Scene[] => {
  const newScenes = [...scenes]
  newScenes.splice(sceneId, 1)
  newScenes.splice(destinationId, 0, scenes[sceneId])
  return newScenes
}

interface ScriptState {
    scripts: Script[]
    activeScriptFilename: string
    setScripts: (scripts: Script[]) => void
    addScript: (script: Script) => void
    setActiveScriptFilename: (filename: string)  => void
    deleteScriptByIndex: (index: number) =>void
    reorderScenes: (sourceId: number, destinationId: number) => void
  }
  
export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [],
  activeScriptFilename: "",

  setActiveScriptFilename: (filename: string)  => set(() => ({activeScriptFilename: filename})),
 
  setScripts: (scripts: Script[]) => set(() => ({scripts: scripts})),
  addScript: (script: Script) => set((state) => ({scripts: state.scripts.concat(script)})),


  reorderScenes: (sourceId: number, destinationId: number) => set((state) => ({
    scripts: state.scripts.map((script) =>
      script.filename !== state.activeScriptFilename
        ? script
        : { ...script, scenes: swapScenes(script.scenes, sourceId, destinationId) }
    )
  })),
  
    
  

  deleteScriptByIndex: (index: number) => set((state) => ({
    scripts: state.scripts.filter((_, i) => i !== index)
  })),

 
  
 
}))

export const useScripts = () => useScriptStore(state => state.scripts)
export const useSetScripts = () => useScriptStore((state) => state.setScripts)
export const useAddScript = () => useScriptStore((state) => state.addScript)


export const useSetActiveScriptFilename = () => useScriptStore((state) => state.setActiveScriptFilename)


export const useDeleteScript = () => useScriptStore((state) => state.deleteScriptByIndex)