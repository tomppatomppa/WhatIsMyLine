import { StateCreator, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { logout } from "../API/loginApi";

export type User = {
  email: string;
  name: string;
  picture: string;
  access_token: string;
  expiry: string;
  user_id: string;
};

interface UserStore {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setAccessToken: (access_token: string, expiry: string) => void;
}

const settingsStore: StateCreator<UserStore> = (set: any) => ({
  user: null,
  login: (user: User) => set(() => ({ user })),
  logout: async () => {
    await logout();
    set(() => ({ user: null }));
  },
  setAccessToken: (access_token: string, expiry: string) =>
    set((state: UserStore) => ({
      user: { ...state.user, access_token, expiry },
    })),
});

export const useUserStore = create<UserStore>()(
  devtools(
    persist(settingsStore, {
      name: "user",
    })
  )
);

export const useLogout = () => useUserStore((state) => state.logout);
export const useLogin = () => useUserStore((state) => state.login);
export const useSetAccessToken = () =>
  useUserStore((state) => state.setAccessToken);

export const useAccessToken = () =>
  useUserStore((state) => state.user?.access_token);

export const useAuth = () =>
  useUserStore((state) => (state.user ? true : false));
export const useCurrentUser = () => useUserStore((state) => state.user);
