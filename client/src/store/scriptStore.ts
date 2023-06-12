import { Scene, Script } from 'src/components/ReaderV3/reader.types'
import { StateCreator, create } from 'zustand'
import { swapLines, swapScenes } from './helpers'
import { devtools, persist } from 'zustand/middleware'

interface ScriptState {
  scripts: Script[]
  activeScriptId: string

}

interface ScriptActions {
  setScripts: (scripts: Script[]) => void
  addScript: (script: Script) => void
  setActiveScriptId: (id: string) => void
  deleteScriptByUuid: (id: string) => void
  updateSceneInScript: (updatedScript: Script) => void
  reorderScenes: (sourceId: number, destinationId: number) => void
  reorderLines: (
    sceneId: string,
    sourceId: number,
    destinationId: number
  ) => void
  getActiveScript: () => Script | undefined
  addLineToScene: (updatedScene: Scene) => void
}

const scriptStore: StateCreator<ScriptState & ScriptActions> = (set, get) => ({
  scripts: [],
  activeScriptId: "",
  
  setActiveScriptId: (id: string) =>
    set(() => ({ activeScriptId: id })),
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
      ({ id, trash }) => id === get().activeScriptId && !trash
    ),

  updateSceneInScript: (updatedScript: Script) =>
      set((state) => ({
        scripts: state.scripts.map((script) => 
        script.id !== state.activeScriptId ? script : updatedScript
       ),
         
      })),
  addLineToScene: (updatedScene: Scene) => set(({scripts, activeScriptId}) => ({
    scripts: scripts.map(script => script.id !== activeScriptId ? script :
      {...script, scenes: script.scenes.map(scene => scene.id !== updatedScene.id ? scene : updatedScene)})
  })),
  reorderScenes: (sourceId: number, destinationId: number) =>
    set((state) => ({
      scripts: state.scripts.map((script) =>
        script.id !== state.activeScriptId
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
        script.id !== activeScriptId
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
        scripts: state.scripts.filter((script) => script.id!== id)
    }))
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

export const useUpdateScene = () => useScriptStore((state) => state.updateSceneInScript)
export const useAddLine = () => useScriptStore((state) => state.addLineToScene)

export const useSetActiveScriptId = () =>
  useScriptStore((state) => state.setActiveScriptId)
export const useDeleteScript = () =>
  useScriptStore((state) => state.deleteScriptByUuid)
export const useActiveScript = () =>
  useScriptStore((state) => state.getActiveScript())
