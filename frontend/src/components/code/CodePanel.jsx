import { useState, useCallback } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { useCodeStore } from "../../stores/codeStore.js"
import { CodeToolbar } from "./CodeToolbar.jsx"
import { CodeEditor } from "./CodeEditor.jsx"
import { CodeStatusBar } from "./CodeStatusBar.jsx"
import { toast } from "../shared/Toast.jsx"

export function CodePanel({ highlightLine, highlightRange, complexity, onFormat, onHighlightExplain }) {
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)
  const setCode = useCodeStore((s) => s.setCode)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)
  const analysisError = useCodeStore((s) => s.analysisError)
  const loadFile = useCodeStore((s) => s.loadFile)
  const [cursorLine, setCursorLine] = useState(1)
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    async (e) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file) {
        const ok = await loadFile(file)
        if (ok) toast.success(`Loaded ${file.name}`)
        else toast.error(useCodeStore.getState().analysisError || "Could not load file")
      }
    },
    [loadFile],
  )

  return (
    <section
      className="flex flex-col h-full min-h-0 bg-[var(--bg-secondary)] relative"
      aria-label="Code input panel"
      onDragOver={(e) => {
        e.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      <CodeToolbar onFormat={onFormat} onHighlightExplain={onHighlightExplain} />

      <div className={"flex flex-col flex-1 min-h-0 relative " + (dragActive ? "drop-active" : "")}>
        {analysisError && (
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--error)] bg-[color-mix(in_srgb,var(--error)_10%,transparent)] border-b border-[var(--error)]">
            <AlertCircle size={14} />
            {analysisError}
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[var(--bg-secondary)]/80 backdrop-blur-sm">
            <Loader2 size={28} className="animate-spin text-[var(--accent-primary)]" />
            <p className="text-sm text-[var(--text-secondary)]">Analyzing code structure…</p>
          </div>
        )}

        {!code.trim() && (
          <div className="absolute top-[13px] left-[64px] pointer-events-none select-none z-10">
            <p className="text-sm text-[var(--text-muted)] opacity-60 font-mono">
              // Paste or write your code here to start...
            </p>
          </div>
        )}

        <CodeEditor
          value={code}
          language={language}
          onChange={setCode}
          highlightLine={highlightLine}
          highlightRange={highlightRange}
          onCursorLine={setCursorLine}
        />

        {dragActive && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[var(--accent-primary)]/10 pointer-events-none">
            <p className="text-sm font-medium text-[var(--accent-primary)]">Drop file to load</p>
          </div>
        )}
      </div>

      <CodeStatusBar code={code} language={language} line={cursorLine} complexity={complexity} />
    </section>
  )
}
