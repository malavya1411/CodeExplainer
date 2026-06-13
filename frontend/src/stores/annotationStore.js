import { create } from "zustand"

const STORAGE_KEY = "code-explainer-annotations"

function load() {
  if (typeof window === "undefined") return { annotations: {}, confusingLines: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { annotations: {}, confusingLines: [] }
    const parsed = JSON.parse(raw)
    return {
      annotations: parsed.annotations || {},
      confusingLines: parsed.confusingLines || [],
    }
  } catch {
    return { annotations: {}, confusingLines: [] }
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ annotations: state.annotations, confusingLines: state.confusingLines }),
    )
  } catch (e) {
    console.warn("Failed to persist annotations in localStorage:", e)
  }
}

const initial = load()

export const useAnnotationStore = create((set, get) => ({
  annotations: initial.annotations,
  confusingLines: initial.confusingLines,
  activeLine: null,
  panelOpen: false,

  openPanel: (line) => set({ panelOpen: true, activeLine: line }),
  closePanel: () => set({ panelOpen: false, activeLine: null }),

  addAnnotation: (line, text) => {
    const annotations = { ...get().annotations }
    if (text && text.trim()) annotations[line] = text.trim()
    else delete annotations[line]
    const next = { annotations }
    set(next)
    persist({ ...get(), ...next })
  },

  removeAnnotation: (line) => {
    const annotations = { ...get().annotations }
    delete annotations[line]
    set({ annotations })
    persist({ ...get(), annotations })
  },

  toggleConfusing: (line) => {
    const set1 = new Set(get().confusingLines)
    if (set1.has(line)) set1.delete(line)
    else set1.add(line)
    const confusingLines = [...set1].sort((a, b) => a - b)
    set({ confusingLines })
    persist({ ...get(), confusingLines })
  },
}))
