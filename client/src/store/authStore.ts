import { create } from 'zustand'
import * as authApi from '../api/auth'
import type { User, LoginRequest } from '../types/auth'

interface AuthState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean

  setToken: (token: string | null) => void
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
  fetchMe: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  setToken: (token) => set({ accessToken: token }),

  login: async (credentials) => {
    const res = await authApi.login(credentials)
    const token = res.headers['authorization']?.replace('Bearer ', '') ?? null
    set({ accessToken: token })
    await get().fetchMe()
    set({ isAuthenticated: true })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // 서버 오류여도 로컬 상태는 초기화
    } finally {
      set({ accessToken: null, user: null, isAuthenticated: false })
    }
  },

  refresh: async () => {
    try {
      const res = await authApi.refreshToken()
      const token = res.headers['authorization']?.replace('Bearer ', '') ?? null
      set({ accessToken: token })
      return true
    } catch {
      return false
    }
  },

  fetchMe: async () => {
    const res = await authApi.getMe()
    set({ user: res.data })
  },

  initialize: async () => {
    const ok = await get().refresh()
    if (ok) {
      await get().fetchMe()
      set({ isAuthenticated: true })
    }
    set({ isInitialized: true })
  }
}))
