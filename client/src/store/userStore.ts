import { StateCreator, create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type User = {
  email: string
  name: string
  picture: string
}

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
}

const settingsStore: StateCreator<UserStore> = (set: any) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user })),
  logout: () => set(() => ({ user: null })),
})

export const useUserStore = create<UserStore>()(
  devtools(
    persist(settingsStore, {
      name: 'user',
    })
  )
)

export const useLogout = () => useUserStore((state) => state.logout)
