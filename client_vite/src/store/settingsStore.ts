import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface SettingsStore {
  loading: boolean
  offlineStorage: boolean
  setLoading: (loadingState: boolean) => void
  setOfflineStorage: (offlineStorage: boolean) => void
}

const settingsStore = (set: any) =>
  ({
    loading: false,
    offlineStorage: true,
    setLoading: (loadingState) => set(() => ({ loading: loadingState })),
  } as SettingsStore)

export const useSettingsStore = create<SettingsStore>()(
  devtools(
    persist(settingsStore, {
      name: 'settings',
    })
  )
)
