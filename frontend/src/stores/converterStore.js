import { create } from "zustand"
import { runConversion, CONVERSION_PROGRESS_STEPS } from "../utils/converterGenerator.js"
import { useCodeStore } from "./codeStore.js"
import { getFileExtension } from "../utils/languageDetector.js"

export const useConverterStore = create((set, get) => ({
  // Config
  sourceLang: "auto",
  targetLang: "python",
  conversionStyle: "idiomatic",
  options: {
    preserveComments: true,
    preserveVariableNames: true,
    preserveCodeStyle: true,
    generateIdiomatic: true,
    addBestPractices: true,
  },

  // State
  originalCode: "",
  convertedCode: "",
  detectedSourceLang: null,
  isConverting: false,
  conversionNotes: [],
  activeTab: "comparison",   // "comparison" | "converted"
  progress: null,            // null | { stepIndex, label }

  // ── Actions ──────────────────────────────────────────────────────────────────

  setSourceLang: (sourceLang) => set({ sourceLang }),
  setTargetLang: (targetLang) => set({ targetLang }),
  setConversionStyle: (conversionStyle) => set({ conversionStyle }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setOption: (key, value) =>
    set((s) => ({ options: { ...s.options, [key]: value } })),

  runConversion: async (code, sourceLang) => {
    const { targetLang, options, conversionStyle } = get()

    if (!code || !code.trim()) return

    const isLarge = code.split("\n").length > 500

    set({
      isConverting: true,
      originalCode: code,
      convertedCode: "",
      conversionNotes: [],
      progress: isLarge ? { stepIndex: 0, label: CONVERSION_PROGRESS_STEPS[0].label } : null,
    })

    if (isLarge) {
      // Simulate multi-step progress for large files
      for (let i = 0; i < CONVERSION_PROGRESS_STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 700))
        set({ progress: { stepIndex: i, label: CONVERSION_PROGRESS_STEPS[i].label } })
      }
      await new Promise((r) => setTimeout(r, 500))
    } else {
      await new Promise((r) => setTimeout(r, 1200))
    }

    const { convertedCode, notes, detectedSourceLang } = runConversion(
      code,
      sourceLang,
      targetLang,
      options,
      conversionStyle
    )

    set({
      convertedCode,
      conversionNotes: notes,
      detectedSourceLang,
      isConverting: false,
      progress: null,
      activeTab: "comparison",
    })
  },

  applyConversion: () => {
    const { convertedCode, targetLang } = get()
    if (!convertedCode) return
    // Push into the main code store
    useCodeStore.setState({
      code: convertedCode,
      language: targetLang,
      languageManual: true,
    })
  },

  exportConvertedFile: () => {
    const { convertedCode, targetLang } = get()
    if (!convertedCode) return
    const ext = getFileExtension(targetLang)
    const blob = new Blob([convertedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `converted_code.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  },

  reset: () =>
    set({
      originalCode: "",
      convertedCode: "",
      conversionNotes: [],
      detectedSourceLang: null,
      isConverting: false,
      progress: null,
      activeTab: "comparison",
    }),
}))
