
import { StateCreator, create } from "zustand";
import { swapLines, swapScenes } from "./helpers";
import { devtools, persist } from "zustand/middleware";
import { updateScript, fetchAllUserScripts, addScript, deleteScriptById } from "../API/scriptApi";
import { Script, Scene } from "../components /ReaderV3/reader.types";
import { findChangedScripts, getSceneNumber } from "../utils/helpers";


export type RootFolder = {
  id: string;
  name: string;
};

interface ScriptState {
  scripts: Script[];
  unsavedChanges: string[];
  activeScriptId: string;
  rootFolder: RootFolder | null;
}

interface ScriptActions {
  updateDatabaseWithLocalChanges: () => Promise<void>;
  fetchAndCompare: () => Promise<Script[]>;

  setScripts: (scripts: Script[]) => void;
  addScript: (script: Script) => void;
  setRootFolder: (rootFolder: RootFolder) => void;
  setActiveScriptId: (id: string) => void;
  deleteScriptByUuid: (id: string) => void;

  reorderScenes: (sourceId: number, destinationId: number) => void;
  reorderLines: (
    sceneId: string,
    sourceId: number,
    destinationId: number
  ) => void;
  getActiveScript: () => Script | undefined;
  getPreviousScene: (sceneNumber: number) => Scene | null;

  updateScene: (updatedScene: Scene) => void;
}

const scriptStore: StateCreator<ScriptState & ScriptActions> = (set, get) => ({
  updateDatabaseWithLocalChanges: async () => {
    await get().fetchAndCompare();
    const toUpdate = get().unsavedChanges;
    const scriptsToUpdate = get().scripts.filter((script) =>
      toUpdate.includes(script.script_id)
    );
    if (scriptsToUpdate.length) {
      await Promise.allSettled(
        scriptsToUpdate.map(async (script) => {
          return await updateScript(script);
        })
      );
      set(() => ({ unsavedChanges: [] }));
    }
  },

  fetchAndCompare: async () => {
    const scriptsInDatabase = await fetchAllUserScripts();
    const scriptsWithUnsavedChanges = findChangedScripts(
      scriptsInDatabase,
      get().scripts
    );
    set(() => ({ unsavedChanges: scriptsWithUnsavedChanges }));
    return scriptsInDatabase;
  },

  scripts: [],
  unsavedChanges: [],
  activeScriptId: "",
  rootFolder: null,

  setActiveScriptId: (id: string) => set(() => ({ activeScriptId: id })),
  setScripts: (scripts: Script[]) => set(() => ({ scripts: scripts })),
  setRootFolder: (rootFolder: RootFolder) => set(() => ({ rootFolder })),

  addScript: async (script: Script) => {
    const addedScript = await addScript(script);
    set((state: { scripts: Script[] }) => ({
      scripts: state.scripts.concat(addedScript),
    }));
  },

  getActiveScript: () =>
    get().scripts.find(
      ({ script_id, trash }) => script_id === get().activeScriptId && !trash
    ),

  getPreviousScene: (sceneNumber): Scene | null => {
    const scripts = get().scripts;
    const targetSceneNumber = sceneNumber - 1;
    const sceneFromScripts =
      scripts
        .flatMap((script) => script.scenes)
        .find((scene) => getSceneNumber(scene.id) === targetSceneNumber) ||
      null;

    return sceneFromScripts;
  },
  /**
   * Active Script mutations
   */
  updateScene: async (updatedScene: Scene) => {
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
    }));
    try {
      const script = get().getActiveScript();
      if (!script) {
        throw new Error("No script selected");
      }
      return await updateScript(script);
    } catch (e) {
      throw new Error("Error updating script");
    }
  },

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

  deleteScriptByUuid: async (id: string) => {
    try {
      await deleteScriptById(id);
      set((state) => ({
        scripts: state.scripts.filter((script) => script.script_id !== id),
      }));
    } catch (e) {
      console.log("Something went wrong deleting script");
    }
  },
});

export const useScriptStore = create<ScriptState & ScriptActions>()(
  devtools(
    persist(scriptStore, {
      name: "scripts",
    })
  )
);

export const useScripts = () => useScriptStore((state) => state.scripts);
export const useSetScripts = () => useScriptStore((state) => state.setScripts);
export const useAddScript = () => useScriptStore((state) => state.addScript);

export const useSetRootFolder = () =>
  useScriptStore((state) => state.setRootFolder);

export const useRootFolder = () => useScriptStore((state) => state.rootFolder);

export const useSetActiveScriptId = () =>
  useScriptStore((state) => state.setActiveScriptId);
export const useDeleteScript = () =>
  useScriptStore((state) => state.deleteScriptByUuid);
export const useActiveScript = () =>
  useScriptStore((state) => state.getActiveScript());

export const useUpdateScript = () =>
  useScriptStore((state) => state.updateScene);

export const usePreviousScene = () =>
  useScriptStore((state) => state.getPreviousScene);
