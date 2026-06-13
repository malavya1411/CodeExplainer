import { create } from "zustand"

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true })
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))
    
    // Simulate successful login
    const user = { email, name: email.split("@")[0] }
    set({ isAuthenticated: true, user, isLoading: false })
    return true
  },

  signup: async (email, password) => {
    set({ isLoading: true })
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate successful signup
    const user = { email, name: email.split("@")[0] }
    set({ isAuthenticated: true, user, isLoading: false })
    return true
  },

  logout: () => {
    set({ isAuthenticated: false, user: null })
  }
}))
