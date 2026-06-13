import { useState, useEffect } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import { Copy, Download, FileText, RefreshCw, Check, CheckSquare, Square, AlertCircle, ChevronDown } from "lucide-react"
import { useCommentStore } from "../../stores/commentStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { toast } from "../shared/Toast.jsx"
import {
  buildCommentedMarkdown,
  buildCommentedHTML,
  downloadCommentedPDF,
  downloadText
} from "../../utils/exportGenerator.js"

export function CommentPreview() {
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)

  const commentedCode = useCommentStore((s) => s.commentedCode)
  const isGenerating = useCommentStore((s) => s.isGenerating)
  const generationError = useCommentStore((s) => s.generationError)
  const commentSettings = useCommentStore((s) => s.commentSettings)
  const generateComments = useCommentStore((s) => s.generateComments)
  const updateSettings = useCommentStore((s) => s.updateSettings)

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)

  const [previewMode, setPreviewMode] = useState("diff") // "diff" or "code"
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [stale, setStale] = useState(false)

  // Auto-generate comments on mount if none exist
  useEffect(() => {
    if (!commentedCode && !isGenerating && !generationError && code) {
      generateComments(code, language)
    }
  }, [code, language, commentedCode, isGenerating, generationError, generateComments])

  // Track if editor code changed since comment generation
  useEffect(() => {
    if (commentedCode) {
      // Clean comment characters to do a structural comparison
      const cleanComments = (str) =>
        str
          .replace(/\/\/.*$/gm, "")
          .replace(/#.*$/gm, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/"""[\s\S]*?"""/g, "")
          .replace(/\s+/g, "")
          .trim();

      const origClean = cleanComments(code)
      const commClean = cleanComments(commentedCode)
      setStale(origClean !== commClean)
    } else {
      setStale(false)
    }
  }, [code, commentedCode])

  const handleCopy = async () => {
    if (!commentedCode) return
    try {
      await navigator.clipboard.writeText(commentedCode)
      toast.success("Commented code copied to clipboard!")
    } catch {
      toast.error("Failed to copy code.")
    }
  }

  const handleDownload = () => {
    if (!commentedCode) return
    const ext = language === "python" ? "py" : (language === "java" ? "java" : (language === "cpp" ? "cpp" : "js"))
    downloadText(`source_commented.${ext}`, commentedCode, "text/plain")
    toast.success("Downloaded commented source file!")
  }

  const handleExportMarkdown = () => {
    if (!commentedCode) return
    const filename = `source_commented.${language === "python" ? "py" : "js"}`
    const md = buildCommentedMarkdown({
      filename,
      commentedCode,
      language,
      depth: commentSettings.depth
    })
    downloadText("commented-report.md", md, "text/markdown")
    toast.success("Exported commented Markdown report!")
  }

  const handleExportHTML = () => {
    if (!commentedCode) return
    const html = buildCommentedHTML({
      filename: "source_commented",
      commentedCode,
      language,
      depth: commentSettings.depth
    })
    downloadText("commented-report.html", html, "text/html")
    toast.success("Exported commented HTML page!")
  }

  const handleExportPDF = async () => {
    if (!commentedCode) return
    try {
      toast.info("Generating PDF report...")
      await downloadCommentedPDF({
        filename: "source_commented",
        commentedCode,
        language,
        depth: commentSettings.depth
      })
      toast.success("PDF report downloaded!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate PDF.")
    }
  }

  const togglePlacement = (key) => {
    const updatedPlacement = {
      ...commentSettings.placement,
      [key]: !commentSettings.placement[key]
    }
    updateSettings({ placement: updatedPlacement })
    // Automatically regenerate comments with new settings
    generateComments(code, language)
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-[var(--text-secondary)] h-full">
        <RefreshCw className="animate-spin text-[var(--accent-primary)]" size={32} />
        <p className="text-sm font-semibold">Analyzing structures & generating educational comments...</p>
      </div>
    )
  }

  if (generationError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center h-full">
        <AlertCircle className="text-red-500" size={36} />
        <p className="text-sm font-semibold text-[var(--text-primary)]">{generationError}</p>
        <button
          onClick={() => generateComments(code, language)}
          className="mt-2 text-xs font-bold rounded-lg px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-on)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!commentedCode) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-[var(--text-muted)] h-full">
        <p className="text-sm">Paste some code to generate inline documentation comments.</p>
        <button
          onClick={() => generateComments(code, language)}
          className="mt-2 text-xs font-bold rounded-lg px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-on)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer"
        >
          Generate Comments Now
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0 space-y-3">
      {stale && (
        <div className="flex items-center justify-between gap-3 px-3 py-2 border border-yellow-500/20 bg-yellow-500/5 text-yellow-600 rounded-xl text-xs select-none">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>The source code was edited. Comments may be outdated.</span>
          </div>
          <button
            onClick={() => generateComments(code, language)}
            className="flex items-center gap-1 font-bold text-[10px] uppercase bg-yellow-600 text-white rounded px-2 py-1 hover:bg-yellow-700 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw size={10} /> Regenerate
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-3 shadow-sm select-none">
        
        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-1 shadow-sm shrink-0">
          <button
            onClick={() => setPreviewMode("diff")}
            className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              previewMode === "diff"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setPreviewMode("code")}
            className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              previewMode === "code"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Final Code
          </button>
        </div>

        {/* Dynamic Placement Toggles */}
        <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-secondary)]">
          <button
            onClick={() => togglePlacement("docstrings")}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)]"
          >
            {commentSettings.placement.docstrings ? (
              <CheckSquare size={14} className="text-[var(--accent-primary)]" />
            ) : (
              <Square size={14} />
            )}
            Docstrings
          </button>
          <button
            onClick={() => togglePlacement("blockAboveControl")}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)]"
          >
            {commentSettings.placement.blockAboveControl ? (
              <CheckSquare size={14} className="text-[var(--accent-primary)]" />
            ) : (
              <Square size={14} />
            )}
            Block Comments
          </button>
          <button
            onClick={() => togglePlacement("inlineComplex")}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--text-primary)]"
          >
            {commentSettings.placement.inlineComplex ? (
              <CheckSquare size={14} className="text-[var(--accent-primary)]" />
            ) : (
              <Square size={14} />
            )}
            Inline Comments
          </button>
        </div>

        {/* Copy/Download/Export Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Copy commented code"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Download file"
          >
            <Download size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-2 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer shadow-sm"
            >
              Export
              <ChevronDown size={13} />
            </button>
            
            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 premium-card shadow-xl py-1 z-40">
                  <button
                    onClick={() => { setExportMenuOpen(false); handleExportMarkdown(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <FileText size={13} /> Markdown Report
                  </button>
                  <button
                    onClick={() => { setExportMenuOpen(false); handleExportHTML(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <FileText size={13} /> HTML Webpage
                  </button>
                  <button
                    onClick={() => { setExportMenuOpen(false); handleExportPDF(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <FileText size={13} /> PDF Document
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Editor Viewer */}
      <div className="flex-1 min-h-[300px] border border-[var(--border)] rounded-2xl overflow-hidden relative shadow-inner bg-[var(--bg-secondary)]">
        {previewMode === "diff" ? (
          <DiffEditor
            original={code}
            modified={commentedCode}
            language={language === "python" ? "python" : "javascript"}
            theme={resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"}
            options={{
              readOnly: true,
              fontSize: 12.5,
              lineHeight: 20,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
            }}
          />
        ) : (
          <Editor
            value={commentedCode}
            language={language === "python" ? "python" : "javascript"}
            theme={resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"}
            options={{
              readOnly: true,
              fontSize: 12.5,
              lineHeight: 20,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
            }}
          />
        )}
      </div>
    </div>
  )
}
