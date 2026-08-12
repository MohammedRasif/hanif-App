import { createMMKV, type MMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserProfile } from "@/api/query-list/auth.query";

export const storage: MMKV = createMMKV({
  id: "barbers-bay-auth-storage",
});

const mmkvStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    storage.remove(name);
  },
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;

  setAuth: (
    tokens: { access: string; refresh: string },
    user?: UserProfile | null,
  ) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setAuth: (tokens, user = null) =>
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          user,
          isAuthenticated: true,
        }),

      setUser: (user) =>
        set({
          user,
        }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
