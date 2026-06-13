import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Settings, Download, ChevronDown, Code2, Play, Share2 } from "lucide-react"
import { useThemeStore } from "../../stores/themeStore.js"
import { IconButton, Tooltip } from "../shared/IconButton.jsx"
import { Button } from "../shared/Button.jsx"

export function Header({ onAnalyze, onExport, onShare, onSettings, isAnalyzing }) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false)
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
          <h1 className="text-sm font-bold text-[var(--text-primary)] leading-tight truncate">
            CodeExplainer
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] leading-tight hidden sm:block">
            Understand code, visually
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="primary"
          size="sm"
          icon={Play}
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="hidden sm:inline-flex"
        >
          {isAnalyzing ? "Analyzing…" : "Explain"}
        </Button>

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
              className="absolute right-0 mt-1.5 w-48 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-xl py-1 z-50 animate-fade-in"
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

        <Tooltip content="Share" position="bottom">
          <IconButton icon={Share2} label="Share explanation" onClick={onShare} />
        </Tooltip>

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
    </header>
  )
}
