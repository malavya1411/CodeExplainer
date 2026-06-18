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
  commentedCodes: {
    beginner: null,
    intermediate: null,
    expert: null,
  },
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
      set({
        commentedCode: null,
        commentedCodes: { beginner: null, intermediate: null, expert: null },
        generationError: "No code provided to comment.",
      })
      return
    }

    set({ isGenerating: true, generationError: null })

    try {
      // Simulate small delay for parser processing
      await new Promise((resolve) => setTimeout(resolve, 1200))
      
      const { commentSettings } = get()
      const beginnerCode = generateCommentedCode(code, language, { ...commentSettings, depth: "beginner" })
      const intermediateCode = generateCommentedCode(code, language, { ...commentSettings, depth: "intermediate" })
      const expertCode = generateCommentedCode(code, language, { ...commentSettings, depth: "expert" })
      
      const activeDepth = commentSettings.depth || "intermediate"
      const activeCommentedCode = {
        beginner: beginnerCode,
        intermediate: intermediateCode,
        expert: expertCode,
      }[activeDepth]

      set({
        commentedCode: activeCommentedCode,
        commentedCodes: {
          beginner: beginnerCode,
          intermediate: intermediateCode,
          expert: expertCode,
        },
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
    set({
      commentedCode: null,
      commentedCodes: { beginner: null, intermediate: null, expert: null },
      lastGenerated: null,
    })
  }
}))
