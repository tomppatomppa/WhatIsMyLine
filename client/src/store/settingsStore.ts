import {create } from 'zustand'
import {  devtools, persist } from 'zustand/middleware'

interface SettingsStore {
  loading: boolean
  setLoading: (loadingState: boolean) => void
}

const settingsStore = (set : any) => ({
  loading: false,
  setLoading: (loadingState) => set(() => ({ loading: loadingState })),
}) as SettingsStore

export const useSettingsStore = create<SettingsStore>()(
 devtools(persist(settingsStore, {
  name: "settings",
})) 
) 