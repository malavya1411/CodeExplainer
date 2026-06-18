import { create } from "zustand"

let playTimer = null

const SPEED_MS = { 0.5: 2400, 1: 1200, 2: 600, 4: 300 }

const syncBlockWithStep = (stepIdx, state) => {
  const explanation = state.explanation
  if (!explanation || !explanation.execution_steps || !explanation.blocks) return {}
  const step = explanation.execution_steps[stepIdx]
  if (!step) return {}
  const blockIdx = explanation.blocks.findIndex(
    (b) => step.line >= b.line_start && step.line <= b.line_end
  )
  if (blockIdx !== -1) {
    return { activeBlockIndex: blockIdx }
  }
  return {}
}

export const useExplanationStore = create((set, get) => ({
  // null until user explicitly clicks Explain
  explanation: null,
  analyzedCode: null,

  // Cache for each depth level — populated on Explain click
  explanations: {
    beginner: null,
    intermediate: null,
    expert: null,
  },

  depth: "intermediate",
  currentStep: 0,
  activeBlockIndex: 0,
  isPlaying: false,
  playbackSpeed: 1,
  activeTab: "Overview",

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
  setAllExplanations: (beginner, intermediate, expert, analyzedCode = null) => {
    const depth = get().depth
    const active = { beginner, intermediate, expert }[depth]
    set({
      explanations: { beginner, intermediate, expert },
      explanation: active,
      currentStep: 0,
      activeBlockIndex: 0,
      isPlaying: false,
      analyzedCode,
    })
  },

  setExplanation: (explanation) =>
    set({ explanation, currentStep: 0, activeBlockIndex: 0, isPlaying: false }),

  /** Reset everything — used when code changes after an analysis */
  clearExplanations: () =>
    set({
      explanation: null,
      analyzedCode: null,
      explanations: { beginner: null, intermediate: null, expert: null },
      currentStep: 0,
      activeBlockIndex: 0,
      isPlaying: false,
    }),

  stepForward: () => {
    const { currentStep, explanation } = get()
    const max = explanation.execution_steps.length - 1
    if (currentStep < max) {
      const nextStep = currentStep + 1
      set({ 
        currentStep: nextStep,
        ...syncBlockWithStep(nextStep, get())
      })
    }
    else get().pause()
  },

  stepBackward: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      set({ 
        currentStep: prevStep,
        ...syncBlockWithStep(prevStep, get())
      })
    }
  },

  reset: () => {
    get().pause()
    set({ currentStep: 0, activeBlockIndex: 0 })
  },

  toEnd: () => {
    get().pause()
    const lastStep = get().explanation.execution_steps.length - 1
    set({ 
      currentStep: lastStep,
      ...syncBlockWithStep(lastStep, get())
    })
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
      const nextStep = currentStep + 1
      set({ 
        currentStep: nextStep,
        ...syncBlockWithStep(nextStep, get())
      })
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
    set({ 
      currentStep,
      ...syncBlockWithStep(currentStep, get())
    })
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
