import { Script } from 'src/components/ReaderV3/reader.types'
import { StateCreator, create } from 'zustand'
import { swapLines, swapScenes } from './helpers'
import { devtools, persist } from 'zustand/middleware'

interface ScriptState {
  scripts: Script[]
  activeScriptFilename: string
}

interface ScriptActions {
  setScripts: (scripts: Script[]) => void
  addScript: (script: Script) => void
  setActiveScriptFilename: (filename: string) => void
  deleteScriptByIndex: (index: number) => void
  reorderScenes: (sourceId: number, destinationId: number) => void
  reorderLines: (
    sceneId: string,
    sourceId: number,
    destinationId: number
  ) => void
  getActiveScript: () => Script | undefined
}

const scriptStore: StateCreator<ScriptState & ScriptActions> = (set, get) => ({
  scripts: [],
  activeScriptFilename: '',

  setActiveScriptFilename: (filename: string) =>
    set(() => ({ activeScriptFilename: filename })),
  setScripts: (scripts: Script[]) => set(() => ({ scripts: scripts })),
  addScript: (script: Script) =>
    set((state: { scripts: Script[] }) => ({
      scripts: state.scripts.concat(script),
    })),

  /**
   * Active Script mutations
   */
  getActiveScript: () =>
    get().scripts.find(
      ({ filename, trash }) => filename === get().activeScriptFilename && !trash
    ),
  reorderScenes: (sourceId: number, destinationId: number) =>
    set((state) => ({
      scripts: state.scripts.map((script) =>
        script.filename !== state.activeScriptFilename
          ? script
          : {
              ...script,
              scenes: swapScenes(script.scenes, sourceId, destinationId),
            }
      ),
    })),
  reorderLines: (sceneId: string, sourceId: number, destinationId: number) =>
    set(({ scripts, activeScriptFilename }) => ({
      scripts: scripts.map((script) =>
        script.filename !== activeScriptFilename
          ? script
          : {
              ...script,
              scenes: script.scenes.map((scene) =>
                scene.id !== sceneId
                  ? scene
                  : swapLines(scene, sourceId, destinationId)
              ),
            }
      ),
    })),

  deleteScriptByIndex: (index: number) =>
    set((state) => ({
      scripts: state.scripts.map((script, i) =>
        i !== index ? script : { ...script, trash: true }
      ),
    })),
})

export const useScriptStore = create<ScriptState & ScriptActions>()(
  devtools(
    persist(scriptStore, {
      name: 'scripts',
    })
  )
)

export const useScripts = () => useScriptStore((state) => state.scripts)
export const useSetScripts = () => useScriptStore((state) => state.setScripts)
export const useAddScript = () => useScriptStore((state) => state.addScript)
export const useSetActiveScriptFilename = () =>
  useScriptStore((state) => state.setActiveScriptFilename)
export const useDeleteScript = () =>
  useScriptStore((state) => state.deleteScriptByIndex)
export const useActiveScript = () =>
  useScriptStore((state) => state.getActiveScript())
