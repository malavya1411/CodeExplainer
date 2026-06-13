import { create } from "zustand"
import { generateOptimizationReport } from "../utils/optimizerGenerator.js"

export const useOptimizerStore = create((set, get) => ({
  originalCode: "",
  modifiedCode: "",
  language: "javascript",
  isOptimizing: false,
  activeCategory: "all",
  explanationLevel: "intermediate",
  appliedOptimizations: [],
  report: null,

  setFilter: (activeCategory) => set({ activeCategory }),
  setExplanationLevel: (explanationLevel) => set({ explanationLevel }),

  runOptimization: async (code, language) => {
    set({ isOptimizing: true, appliedOptimizations: [], report: null })
    
    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const report = generateOptimizationReport(code, language)
    set({
      originalCode: code,
      modifiedCode: code,
      language,
      report,
      isOptimizing: false
    })
  },

  applyOptimization: (id) => {
    const { report, modifiedCode, appliedOptimizations } = get()
    if (!report) return

    const improvement = report.improvements.find((imp) => imp.id === id)
    if (!improvement || appliedOptimizations.includes(id)) return

    // Apply specific search-and-replace snippet
    const nextCode = modifiedCode.replaceAll(improvement.originalSnippet, improvement.optimizedSnippet)
    
    set({
      modifiedCode: nextCode,
      appliedOptimizations: [...appliedOptimizations, id]
    })
  },

  revertOptimization: (id) => {
    const { report, modifiedCode, appliedOptimizations } = get()
    if (!report) return

    const improvement = report.improvements.find((imp) => imp.id === id)
    if (!improvement || !appliedOptimizations.includes(id)) return

    // Revert snippet substitution
    const nextCode = modifiedCode.replaceAll(improvement.optimizedSnippet, improvement.originalSnippet)

    set({
      modifiedCode: nextCode,
      appliedOptimizations: appliedOptimizations.filter((item) => item !== id)
    })
  },

  applyAll: () => {
    const { report, originalCode } = get()
    if (!report) return

    set({
      modifiedCode: report.optimizedCode,
      appliedOptimizations: report.improvements.map((imp) => imp.id)
    })
  },

  revertAll: () => {
    const { originalCode } = get()
    set({
      modifiedCode: originalCode,
      appliedOptimizations: []
    })
  }
}))
