import { Scene, Script } from 'src/components/ReaderV3/reader.types'
import {  create } from 'zustand'

interface ScriptState {
    scripts: Script[]
  
    activeScript: Script | null
    setScripts: (scripts: Script[]) => void
    addScript: (script: Script) => void

    setActiveScript: (index: number) => void
    
   
    addScene: (scene: Scene) => void

   
  }
  
export const useScriptStore = create<ScriptState>((set, get) => ({
  scripts: [],

  activeScript: null,
  setActiveScript: (index: number)  => set((state) => ({activeScript: state.scripts[index]})),
  setScripts: (scripts: Script[]) => set(() => ({scripts: scripts})),
  addScript: (script: Script) => set((state) => ({scripts: state.scripts.concat(script)})),
  
  
  addScene: (scene) => 
    set((state) => ({
    ...state,
    activeScript: state.activeScript
    ? { ...state.activeScript, scenes: [scene, ...state.activeScript.scenes] }
    : null
  }))
  
 
}))

export const useScripts = () => useScriptStore(state => state.scripts)
export const useSetScripts = () => useScriptStore((state) => state.setScripts)
export const useAddScript = () => useScriptStore((state) => state.addScript)
export const useAddScene = () => useScriptStore((state) => state.addScene)
export const useGetActiveScript = () => useScriptStore((state) => state.activeScript)