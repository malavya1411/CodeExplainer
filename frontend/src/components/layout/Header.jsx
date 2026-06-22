import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Settings, Download, ChevronDown, Code2, MessageSquare, Eye, EyeOff } from "lucide-react"
import { useThemeStore } from "../../stores/themeStore.js"
import { useAuthStore } from "../../stores/authStore.js"
import { useCommentStore } from "../../stores/commentStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { CommentSettingsModal } from "./CommentSettingsModal.jsx"
import { IconButton, Tooltip } from "../shared/IconButton.jsx"
import { Button } from "../shared/Button.jsx"

export function Header({
  onAnalyze,
  onExport,
  onShare,
  onSettings,
  isAnalyzing,
  activeWorkspace = "explainer",
  onWorkspaceChange,
}) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  
  const showInlineComments = useCommentStore((s) => s.showInlineComments)
  const setShowInlineComments = useCommentStore((s) => s.setShowInlineComments)
  const generateComments = useCommentStore((s) => s.generateComments)
  const updateSettings = useCommentStore((s) => s.updateSettings)
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)

  const [exportOpen, setExportOpen] = useState(false)
  const [commentsMenuOpen, setCommentsMenuOpen] = useState(false)
  const [commentSettingsOpen, setCommentSettingsOpen] = useState(false)
  
  const exportRef = useRef(null)
  const commentsRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
      if (commentsRef.current && !commentsRef.current.contains(e.target)) setCommentsMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const exportFormats = [
    { id: "markdown", label: "Markdown (.md)" },
    { id: "pdf", label: "PDF document" },
    { id: "html", label: "HTML (interactive)" },
    { id: "notion", label: "Notion import" },
    { id: "share", label: "Share link" },
  ]

  return (
    <header className="flex items-center justify-between gap-3 px-4 h-14 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-[var(--accent-primary)] text-[var(--accent-on)] shrink-0">
          <Code2 size={18} />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold font-body text-[var(--text-primary)] leading-tight truncate">
            CodeExplainer
          </h1>
          <p className="text-caption font-body text-[var(--text-muted)] leading-tight hidden sm:block">
            Understand code, visually
          </p>
        </div>

        {/* Workspace Switcher */}
        <div className="flex items-center bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-0.5 shadow-sm ml-4 select-none shrink-0">
          <button
            onClick={() => onWorkspaceChange("explainer")}
            className={`text-nav font-body font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeWorkspace === "explainer"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Explainer
          </button>
          <button
            onClick={() => onWorkspaceChange("optimizer")}
            className={`text-nav font-body font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeWorkspace === "optimizer"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Optimizer
          </button>
          <button
            onClick={() => onWorkspaceChange("converter")}
            className={`text-nav font-body font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeWorkspace === "converter"
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Convert
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Comments Dropdown */}
        <div className="relative" ref={commentsRef}>
          <Button
            variant="secondary"
            size="sm"
            icon={MessageSquare}
            iconRight={ChevronDown}
            onClick={() => setCommentsMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={commentsMenuOpen}
          >
            <span className="hidden md:inline">Comments</span>
          </Button>
          {commentsMenuOpen && (
            <div
              role="menu"
              className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-48 premium-card shadow-xl py-1 z-50 animate-fade-in"
            >
              <button
                role="menuitem"
                onClick={() => {
                  setShowInlineComments(!showInlineComments)
                  setCommentsMenuOpen(false)
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] font-semibold"
              >
                <span className="flex items-center gap-2">
                  {showInlineComments ? <Eye size={13} className="text-[var(--accent-primary)]" /> : <EyeOff size={13} />}
                  Inline Comments
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-normal">Ctrl+/</span>
              </button>
              
              <div className="h-px bg-[var(--border)] my-1" />
              
              <button
                role="menuitem"
                onClick={() => {
                  setCommentsMenuOpen(false)
                  updateSettings({ depth: "beginner" })
                  useExplanationStore.getState().setDepth("beginner")
                  const comments = useCommentStore.getState().commentedCodes
                  if (comments && comments["beginner"]) {
                    useCommentStore.setState({ commentedCode: comments["beginner"] })
                  } else {
                    generateComments(code, language)
                  }
                  useExplanationStore.getState().setActiveTab("Comments")
                  if (activeWorkspace !== "explainer" && onWorkspaceChange) {
                    onWorkspaceChange("explainer")
                  }
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                <span>Generate (Beginner)</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setCommentsMenuOpen(false)
                  updateSettings({ depth: "intermediate" })
                  useExplanationStore.getState().setDepth("intermediate")
                  const comments = useCommentStore.getState().commentedCodes
                  if (comments && comments["intermediate"]) {
                    useCommentStore.setState({ commentedCode: comments["intermediate"] })
                  } else {
                    generateComments(code, language)
                  }
                  useExplanationStore.getState().setActiveTab("Comments")
                  if (activeWorkspace !== "explainer" && onWorkspaceChange) {
                    onWorkspaceChange("explainer")
                  }
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                <span>Generate (Intermediate)</span>
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setCommentsMenuOpen(false)
                  updateSettings({ depth: "expert" })
                  useExplanationStore.getState().setDepth("expert")
                  const comments = useCommentStore.getState().commentedCodes
                  if (comments && comments["expert"]) {
                    useCommentStore.setState({ commentedCode: comments["expert"] })
                  } else {
                    generateComments(code, language)
                  }
                  useExplanationStore.getState().setActiveTab("Comments")
                  if (activeWorkspace !== "explainer" && onWorkspaceChange) {
                    onWorkspaceChange("explainer")
                  }
                }}
                className="flex items-center justify-between w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                <span>Generate (Expert)</span>
              </button>
              
              <div className="h-px bg-[var(--border)] my-1" />
              
              <button
                role="menuitem"
                onClick={() => {
                  setCommentsMenuOpen(false)
                  setCommentSettingsOpen(true)
                }}
                className="flex items-center w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              >
                <span>Comment Settings...</span>
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={exportRef}>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            iconRight={ChevronDown}
            onClick={() => setExportOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={exportOpen}
          >
            <span className="hidden md:inline">Export</span>
          </Button>
          {exportOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-1.5 w-48 premium-card shadow-xl py-1 z-50 animate-fade-in"
            >
              {exportFormats.map((f) => (
                <button
                  key={f.id}
                  role="menuitem"
                  onClick={() => {
                    setExportOpen(false)
                    if (f.id === "share") onShare()
                    else onExport(f.id)
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Tooltip content={resolvedTheme === "dark" ? "Light mode" : "Dark mode"} position="bottom">
          <IconButton
            icon={resolvedTheme === "dark" ? Sun : Moon}
            label="Toggle theme"
            onClick={toggleTheme}
          />
        </Tooltip>

        <Tooltip content="Settings" position="bottom">
          <IconButton icon={Settings} label="Open settings" onClick={onSettings} />
        </Tooltip>
      </div>

      <CommentSettingsModal
        isOpen={commentSettingsOpen}
        onClose={() => setCommentSettingsOpen(false)}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={onWorkspaceChange}
      />
    </header>
  )
}
