import { create } from "zustand"

const STORAGE_KEY = "code-explainer-theme"

function getInitialPreference() {
  try {
    if (typeof window === "undefined") return "system"
    return localStorage.getItem(STORAGE_KEY) || "system"
  } catch (e) {
    console.warn("Failed to read theme from localStorage:", e)
    return "system"
  }
}

function systemTheme() {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolve(theme) {
  return theme === "system" ? systemTheme() : theme
}

function apply(resolved) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", resolved)
  }
}

const initialTheme = getInitialPreference()
const initialResolved = resolve(initialTheme)
apply(initialResolved)

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  resolvedTheme: initialResolved,
  setTheme: (theme) => {
    const resolved = resolve(theme)
    apply(resolved)
    try {
      if (theme === "system") localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) {
      console.warn("Failed to write theme to localStorage:", e)
    }
    set({ theme, resolvedTheme: resolved })
  },
  toggleTheme: () => {
    const next = get().resolvedTheme === "dark" ? "light" : "dark"
    get().setTheme(next)
  },
  syncSystem: () => {
    if (get().theme === "system") {
      const resolved = systemTheme()
      apply(resolved)
      set({ resolvedTheme: resolved })
    }
  },
}))

// Accessibility toggles
export const useA11yStore = create((set, get) => ({
  dyslexiaFont: false,
  colorBlind: false,
  setDyslexiaFont: (v) => {
    document.documentElement.setAttribute("data-dyslexia", String(v))
    set({ dyslexiaFont: v })
  },
  setColorBlind: (v) => {
    document.documentElement.setAttribute("data-colorblind", String(v))
    set({ colorBlind: v })
  },
}))
