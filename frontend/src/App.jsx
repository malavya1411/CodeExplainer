import { useState, useCallback, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Header } from "./components/layout/Header.jsx"
import { CodePanel } from "./components/code/CodePanel.jsx"
import { ExplanationPanel } from "./components/explanation/ExplanationPanel.jsx"
import { SettingsModal } from "./components/layout/SettingsModal.jsx"
import { ShareModal } from "./components/layout/ShareModal.jsx"
import { AnnotationPanel } from "./components/layout/AnnotationPanel.jsx"
import { ToastContainer, toast } from "./components/shared/Toast.jsx"
import { useCodeStore } from "./stores/codeStore.js"
import { useExplanationStore } from "./stores/explanationStore.js"
import { useAnnotationStore } from "./stores/annotationStore.js"
import { useThemeStore } from "./stores/themeStore.js"
import { buildMarkdown, buildHTML, buildNotion, downloadText, downloadPDF } from "./utils/exportGenerator.js"
import { analyzeComplexity } from "./utils/complexityAnalyzer.js"
import { mockExplanation } from "./data/mockExplanation.js"

export default function App() {
  const syncSystemTheme = useThemeStore((s) => s.syncSystemTheme)
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)
  const setAnalyzing = useCodeStore((s) => s.setAnalyzing)
  
  const explanation = useExplanationStore((s) => s.explanation)
  const setExplanation = useExplanationStore((s) => s.setExplanation)
  const depth = useExplanationStore((s) => s.depth)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const setDepth = useExplanationStore((s) => s.setDepth)

  const annotations = useAnnotationStore((s) => s.annotations)

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  
  const [complexity, setComplexity] = useState(null)
  
  // Highlight currently active line from explanation if available
  const activeLine = explanation?.execution_steps?.[currentStep]?.line

  useEffect(() => {
    // Listen for system theme changes if needed
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => useThemeStore.getState().syncSystem?.()
    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (code) {
      setComplexity(analyzeComplexity(code))
    }
  }, [code])

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.warning("Please enter some code first")
      return
    }
    setAnalyzing(true)
    // Simulate API delay
    setTimeout(() => {
      setExplanation(mockExplanation)
      setAnalyzing(false)
      toast.success("Code analyzed successfully")
    }, 1500)
  }

  const handleExport = async (format) => {
    if (!explanation) {
      toast.error("Nothing to export. Analyze code first.")
      return
    }
    const data = { code, language, explanation, depth, annotations }
    try {
      if (format === "markdown") {
        downloadText("explanation.md", buildMarkdown(data), "text/markdown")
      } else if (format === "html") {
        downloadText("explanation.html", buildHTML(data), "text/html")
      } else if (format === "notion") {
        downloadText("notion-import.md", buildNotion(data), "text/markdown")
      } else if (format === "pdf") {
        toast.info("Generating PDF...")
        await downloadPDF(data)
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to generate export")
    }
  }

  const handleFormat = () => {
    toast.info("Formatting code... (mock)")
  }

  const handleHighlightExplain = () => {
    toast.info("Highlight & Explain triggered (mock)")
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        handleAnalyze()
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault()
        setShareOpen(true)
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault()
        useThemeStore.getState().toggleTheme()
      } else if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault()
        useAnnotationStore.getState().openPanel(1) // Open for line 1 as fallback
      } else if (e.key === "Escape") {
        setSettingsOpen(false)
        setShareOpen(false)
        useAnnotationStore.getState().closePanel()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden antialiased">
      <Header
        onAnalyze={handleAnalyze}
        onExport={handleExport}
        onShare={() => setShareOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        isAnalyzing={isAnalyzing}
      />
      
      <main className="flex-1 min-h-0 relative">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={45} minSize={30} className="h-full">
            <CodePanel
              highlightLine={activeLine}
              complexity={complexity}
              onFormat={handleFormat}
              onHighlightExplain={handleHighlightExplain}
            />
          </Panel>
          
          <PanelResizeHandle className="w-1.5 bg-[var(--border)] hover:bg-[var(--accent-primary)] transition-colors cursor-col-resize z-10" />
          
          <Panel defaultSize={55} minSize={30} className="h-full">
            <ExplanationPanel complexity={complexity} />
          </Panel>
        </PanelGroup>
        
        <AnnotationPanel />
      </main>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      <ToastContainer />
    </div>
  )
}
