import { create } from "zustand"
import { generateCommentedCode } from "../utils/commentGenerator.js"

const DEFAULT_SETTINGS = {
  depth: "intermediate",
  placement: {
    docstrings: true,
    inlineComplex: true,
    blockAboveControl: true,
    simpleVariables: false,
    complexityNotes: true,
  },
  style: {
    useAnalogies: true,
    includeTypes: true,
    includeAuthor: false,
    noteEdgeCases: true,
    suggestAlternatives: false,
  },
  formatting: {
    maxLength: 80,
    indentation: "match",
    fixedIndent: 0,
    blankLinesBetweenSections: true,
  },
}

export const useCommentStore = create((set, get) => ({
  commentedCode: null,
  isGenerating: false,
  generationError: null,
  showInlineComments: false,
  lastGenerated: null,
  commentSettings: { ...DEFAULT_SETTINGS },

  updateSettings: (newSettings) => {
    set((state) => ({
      commentSettings: {
        ...state.commentSettings,
        ...newSettings,
        placement: {
          ...state.commentSettings.placement,
          ...(newSettings.placement || {}),
        },
        style: {
          ...state.commentSettings.style,
          ...(newSettings.style || {}),
        },
        formatting: {
          ...state.commentSettings.formatting,
          ...(newSettings.formatting || {}),
        },
      },
    }))
  },

  resetSettings: () => {
    set({ commentSettings: { ...DEFAULT_SETTINGS } })
  },

  setShowInlineComments: (showInlineComments) => {
    set({ showInlineComments })
  },

  generateComments: async (code, language) => {
    if (!code) {
      set({ commentedCode: null, generationError: "No code provided to comment." })
      return
    }

    set({ isGenerating: true, generationError: null })

    try {
      // Simulate small delay for parser processing
      await new Promise((resolve) => setTimeout(resolve, 1200))
      
      const { commentSettings } = get()
      const commented = generateCommentedCode(code, language, commentSettings)
      
      set({
        commentedCode: commented,
        showInlineComments: true,
        isGenerating: false,
        lastGenerated: new Date().toISOString(),
      })
    } catch (err) {
      console.error(err)
      set({
        isGenerating: false,
        generationError: "An error occurred while generating code comments.",
      })
    }
  },

  clearCommentedCode: () => {
    set({ commentedCode: null, lastGenerated: null })
  }
}))
