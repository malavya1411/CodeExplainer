import { create } from "zustand"
import { defaultCode } from "../data/mockExplanation.js"
import { detectLanguageFromContent } from "../utils/languageDetector.js"

const MAX_SIZE = 1024 * 1024 // 1MB

export const useCodeStore = create((set, get) => ({
  code: defaultCode,
  language: "javascript",
  languageManual: false,
  isAnalyzing: false,
  analysisError: null,

  setCode: (code) => {
    const state = get()
    const update = { code, analysisError: null }
    if (!state.languageManual) {
      update.language = detectLanguageFromContent(code)
    }
    set(update)
  },

  setLanguage: (language) => set({ language, languageManual: true }),

  clearCode: () => set({ code: "", analysisError: null }),

  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (analysisError) => set({ analysisError, isAnalyzing: false }),

  loadFile: async (file) => {
    if (file.size > MAX_SIZE) {
      set({ analysisError: "File exceeds 1MB limit. Try a smaller snippet." })
      return false
    }
    const ext = file.name.split(".").pop()?.toLowerCase()
    const { SUPPORTED_EXTENSIONS, detectLanguageFromExtension } = await import(
      "../utils/languageDetector.js"
    )
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      set({
        analysisError: `We don't support .${ext} files yet. Supported: .py, .js, .ts, .java, .cpp, .go, .rs, .cs, .rb, .php`,
      })
      return false
    }
    const text = await file.text()
    const lang = detectLanguageFromExtension(file.name) || detectLanguageFromContent(text)
    set({ code: text, language: lang, languageManual: true, analysisError: null })
    return true
  },

  loadFromUrl: async (url) => {
    set({ isAnalyzing: true, analysisError: null })
    try {
      let raw = url.trim()
      // Convert github blob urls to raw
      if (raw.includes("github.com") && raw.includes("/blob/")) {
        raw = raw
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/")
      }
      const res = await fetch(raw)
      if (!res.ok) throw new Error("bad status")
      const text = await res.text()
      const { detectLanguageFromExtension } = await import("../utils/languageDetector.js")
      const lang = detectLanguageFromExtension(raw) || detectLanguageFromContent(text)
      set({ code: text, language: lang, languageManual: true, isAnalyzing: false })
      return true
    } catch (e) {
      set({
        isAnalyzing: false,
        analysisError: "Could not fetch from URL. Check the link and try again.",
      })
      return false
    }
  },
}))
