import { create } from "zustand"

let playTimer = null

const SPEED_MS = { 0.5: 2400, 1: 1200, 2: 600, 4: 300 }

export const useExplanationStore = create((set, get) => ({
  // null until user explicitly clicks Explain
  explanation: null,

  // Cache for each depth level — populated on Explain click
  explanations: {
    beginner: null,
    intermediate: null,
    expert: null,
  },

  // Adaptive mode: "detailed" | "chunk" | "architecture" | "explorer"
  explanationMode: "detailed",

  depth: "intermediate",
  currentStep: 0,
  activeBlockIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  activeTab: "Overview",

  // Navigation indices for adaptive modes
  activeChunkIndex: 0,
  activeModuleIndex: 0,
  activeTreeNodeKey: null,
  // Line range highlighted in Monaco (for chunk/module selection)
  highlightRange: null,

  setActiveTab: (activeTab) => set({ activeTab }),

  setDepth: (depth) => {
    const cached = get().explanations[depth]
    set({ depth, explanation: cached, currentStep: 0, activeBlockIndex: 0, isPlaying: false })
  },

  setActiveBlockIndex: (activeBlockIndex) => {
    set({ activeBlockIndex })
    const explanation = get().explanation
    const block = explanation?.blocks?.[activeBlockIndex]
    if (block && explanation?.execution_steps) {
      const stepIdx = explanation.execution_steps.findIndex(
        (s) => s.line >= block.line_start && s.line <= block.line_end
      )
      if (stepIdx !== -1) {
        set({ currentStep: stepIdx })
      }
    }
  },

  /** Called once per Explain click — stores all three level results */
  setAllExplanations: (beginner, intermediate, expert, mode) => {
    const depth = get().depth
    const active = { beginner, intermediate, expert }[depth]
    set({
      explanations: { beginner, intermediate, expert },
      explanation: active,
      explanationMode: mode || active?.mode || "detailed",
      currentStep: 0,
      activeBlockIndex: 0,
      isPlaying: false,
      activeChunkIndex: 0,
      activeModuleIndex: 0,
      activeTreeNodeKey: null,
      highlightRange: null,
    })
  },

  setExplanation: (explanation) =>
    set({ explanation, currentStep: 0, activeBlockIndex: 0, isPlaying: false }),

  /** Reset everything — used when code changes after an analysis */
  clearExplanations: () =>
    set({
      explanation: null,
      explanations: { beginner: null, intermediate: null, expert: null },
      explanationMode: "detailed",
      currentStep: 0,
      activeBlockIndex: 0,
      isPlaying: false,
      activeChunkIndex: 0,
      activeModuleIndex: 0,
      activeTreeNodeKey: null,
      highlightRange: null,
    }),

  // ── Adaptive navigation ──────────────────────────────────────────────────

  /** Select a chunk by index — highlights its line range in Monaco */
  selectChunk: (index) => {
    const explanation = get().explanation
    const chunks = explanation?.chunks
    if (!chunks || !chunks[index]) return
    const chunk = chunks[index]
    set({
      activeChunkIndex: index,
      currentStep: index,
      highlightRange: { start: chunk.line_start, end: chunk.line_end },
    })
  },

  /** Select a module by index — highlights its line scope in Monaco */
  selectModule: (index) => {
    const explanation = get().explanation
    const modules = explanation?.modules
    if (!modules || !modules[index]) return
    const mod = modules[index]
    set({
      activeModuleIndex: index,
      highlightRange: { start: mod.lineStart, end: mod.lineEnd },
    })
  },

  /** Select a tree node by key */
  selectTreeNode: (key, lineStart, lineEnd) => {
    set({
      activeTreeNodeKey: key,
      highlightRange: lineStart != null ? { start: lineStart, end: lineEnd } : null,
    })
  },

  clearHighlightRange: () => set({ highlightRange: null }),

  // ── Step-by-step playback ────────────────────────────────────────────────

  stepForward: () => {
    const { currentStep, explanation } = get()
    const steps = explanation?.execution_steps || []
    const max = steps.length - 1
    if (currentStep < max) set({ currentStep: currentStep + 1 })
    else get().pause()
  },

  stepBackward: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },

  reset: () => {
    get().pause()
    set({ currentStep: 0 })
  },

  toEnd: () => {
    get().pause()
    const steps = get().explanation?.execution_steps || []
    set({ currentStep: Math.max(0, steps.length - 1) })
  },

  play: () => {
    if (get().isPlaying) return
    set({ isPlaying: true })
    const tick = () => {
      const { currentStep, explanation } = get()
      const steps = explanation?.execution_steps || []
      const max = steps.length - 1
      if (currentStep >= max) {
        get().pause()
        return
      }
      set({ currentStep: get().currentStep + 1 })
      playTimer = setTimeout(tick, SPEED_MS[get().playbackSpeed])
    }
    playTimer = setTimeout(tick, SPEED_MS[get().playbackSpeed])
  },

  pause: () => {
    if (playTimer) {
      clearTimeout(playTimer)
      playTimer = null
    }
    set({ isPlaying: false })
  },

  togglePlay: () => {
    if (get().isPlaying) get().pause()
    else get().play()
  },

  setSpeed: (playbackSpeed) => set({ playbackSpeed }),

  goToStep: (currentStep) => {
    get().pause()
    set({ currentStep })
  },
}))

// Derived helper: cumulative variable state up to current step.
export function getActiveState(explanation, currentStep) {
  const state = {}
  const steps = explanation?.execution_steps || []
  for (let i = 0; i <= currentStep && i < steps.length; i++) {
    const changes = steps[i].state_changes || {}
    Object.entries(changes).forEach(([k, v]) => {
      state[k] = v
    })
  }
  return state
}
