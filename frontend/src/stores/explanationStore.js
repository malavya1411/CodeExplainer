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

  depth: "intermediate",
  currentStep: 0,
  isPlaying: false,
  playbackSpeed: 1,
  activeTab: "Overview",

  setActiveTab: (activeTab) => set({ activeTab }),
  setDepth: (depth) => {
    const cached = get().explanations[depth]
    set({ depth, explanation: cached, currentStep: 0, isPlaying: false })
  },

  /** Called once per Explain click — stores all three level results */
  setAllExplanations: (beginner, intermediate, expert) => {
    const depth = get().depth
    const active = { beginner, intermediate, expert }[depth]
    set({
      explanations: { beginner, intermediate, expert },
      explanation: active,
      currentStep: 0,
      isPlaying: false,
    })
  },

  setExplanation: (explanation) =>
    set({ explanation, currentStep: 0, isPlaying: false }),

  /** Reset everything — used when code changes after an analysis */
  clearExplanations: () =>
    set({
      explanation: null,
      explanations: { beginner: null, intermediate: null, expert: null },
      currentStep: 0,
      isPlaying: false,
    }),

  stepForward: () => {
    const { currentStep, explanation } = get()
    const max = explanation.execution_steps.length - 1
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
    set({ currentStep: get().explanation.execution_steps.length - 1 })
  },

  play: () => {
    if (get().isPlaying) return
    set({ isPlaying: true })
    const tick = () => {
      const { currentStep, explanation } = get()
      const max = explanation.execution_steps.length - 1
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
  for (let i = 0; i <= currentStep && i < explanation.execution_steps.length; i++) {
    const changes = explanation.execution_steps[i].state_changes || {}
    Object.entries(changes).forEach(([k, v]) => {
      state[k] = v
    })
  }
  return state
}
