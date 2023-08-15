import { Scene, Script } from 'src/components/ReaderV3/reader.types'
import { StateCreator, create } from 'zustand'
import { swapLines, swapScenes } from './helpers'
import { devtools, persist } from 'zustand/middleware'

export type RootFolder = {
  id: string
  name: string
}

interface ScriptState {
  scripts: Script[]
  activeScriptId: string
  rootFolder: RootFolder | null
}

interface ScriptActions {
  setScripts: (scripts: Script[]) => void
  addScript: (script: Script) => void
  setRootFolder: (rootFolder: RootFolder) => void
  setActiveScriptId: (id: string) => void
  deleteScriptByUuid: (id: string) => void

  reorderScenes: (sourceId: number, destinationId: number) => void
  reorderLines: (
    sceneId: string,
    sourceId: number,
    destinationId: number
  ) => void
  getActiveScript: () => Script | undefined
  updateScene: (updatedScene: Scene) => void
}

const scriptStore: StateCreator<ScriptState & ScriptActions> = (set, get) => ({
  scripts: [],
  activeScriptId: '',
  rootFolder: null,

  setActiveScriptId: (id: string) => set(() => ({ activeScriptId: id })),
  setScripts: (scripts: Script[]) => set(() => ({ scripts: scripts })),
  setRootFolder: (rootFolder: RootFolder) => set(() => ({ rootFolder })),

  addScript: (script: Script) =>
    set((state: { scripts: Script[] }) => ({
      scripts: state.scripts.concat(script),
    })),

  getActiveScript: () =>
    get().scripts.find(
      ({ script_id, trash }) => script_id === get().activeScriptId && !trash
    ),

  /**
   * Active Script mutations
   */
  updateScene: (updatedScene: Scene) =>
    set(({ scripts, activeScriptId }) => ({
      scripts: scripts.map((script) =>
        script.script_id !== activeScriptId
          ? script
          : {
              ...script,
              scenes: script.scenes.map((scene) =>
                scene.id !== updatedScene.id ? scene : updatedScene
              ),
            }
      ),
    })),
  reorderScenes: (sourceId: number, destinationId: number) =>
    set((state) => ({
      scripts: state.scripts.map((script) =>
        script.script_id !== state.activeScriptId
          ? script
          : {
              ...script,
              scenes: swapScenes(script.scenes, sourceId, destinationId),
            }
      ),
    })),

  reorderLines: (sceneId: string, sourceId: number, destinationId: number) =>
    set(({ scripts, activeScriptId }) => ({
      scripts: scripts.map((script) =>
        script.script_id !== activeScriptId
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

  deleteScriptByUuid: (id: string) =>
    set((state) => ({
      scripts: state.scripts.filter((script) => script.script_id !== id),
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

export const useSetRootFolder = () =>
  useScriptStore((state) => state.setRootFolder)

export const useRootFolder = () => useScriptStore((state) => state.rootFolder)

export const useSetActiveScriptId = () =>
  useScriptStore((state) => state.setActiveScriptId)
export const useDeleteScript = () =>
  useScriptStore((state) => state.deleteScriptByUuid)
export const useActiveScript = () =>
  useScriptStore((state) => state.getActiveScript())

export const useUpdateScript = () =>
  useScriptStore((state) => state.updateScene)
