import { Script } from 'src/components/ReaderV3/reader.types'
import {  StateCreator, create } from 'zustand'
import { swapScenes } from './helpers'
import { devtools, persist } from 'zustand/middleware'

interface ScriptState {
  scripts: Script[]
  activeScriptFilename: string
}

interface ScriptActions {
  setScripts: (scripts: Script[]) => void
  addScript: (script: Script) => void
  setActiveScriptFilename: (filename: string)  => void
  deleteScriptByIndex: (index: number) =>void
  reorderScenes: (sourceId: number, destinationId: number) => void
}

const scriptStore: StateCreator<ScriptState & ScriptActions> = ((set) => ({
  scripts: [],
  activeScriptFilename: "",
  
  setActiveScriptFilename: (filename: string) => set(() => ({ activeScriptFilename: filename })),
  setScripts: (scripts: Script[]) => set(() => ({ scripts: scripts })),
  addScript: (script: Script) => set((state: { scripts: any[]} ) => ({ scripts: state.scripts.concat(script) })),
 
  reorderScenes: (sourceId: number, destinationId: number) => set((state) => ({
    scripts: state.scripts.map((script) => script.filename !== state.activeScriptFilename
      ? script
      : { ...script, scenes: swapScenes(script.scenes, sourceId, destinationId) }
    )
  })),
  deleteScriptByIndex: (index: number) => set((state) => ({
    scripts: state.scripts.filter((_, i) => i !== index)
  })),
}))

export const useScriptStore = create<ScriptState & ScriptActions>()(
  devtools(persist(scriptStore, {
   name: "scripts",
 })) 
 ) 



export const useScripts = () => useScriptStore(state => state.scripts)
export const useSetScripts = () => useScriptStore((state) => state.setScripts)
export const useAddScript = () => useScriptStore((state) => state.addScript)
export const useSetActiveScriptFilename = () => useScriptStore((state) => state.setActiveScriptFilename)
export const useDeleteScript = () => useScriptStore((state) => state.deleteScriptByIndex)