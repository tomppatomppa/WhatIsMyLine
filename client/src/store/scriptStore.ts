import { Script } from 'src/components/ReaderV3/reader.types'
import {  create } from 'zustand'

interface ScriptState {
    scripts: Script[]
    setScripts: (scripts: Script[]) => void
    addScript: (script: Script) => void
  }
  
const useScriptStore = create<ScriptState>((set) => ({
  scripts: [],
  setScripts: (scripts: Script[]) => set(() => ({scripts: scripts})),
  addScript: (script) => set((state) => ({scripts: state.scripts.concat(script)}))
}))

export const useScript = () => useScriptStore(state => state.scripts)
export const useSetScripts = () => useScriptStore((state) => state.setScripts)
export const useAddScript = () => useScriptStore((state) => state.addScript)
