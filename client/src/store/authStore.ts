import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  setToken: (token) => set({ accessToken: token }),
}));
