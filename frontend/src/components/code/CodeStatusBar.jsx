import { getLanguageLabel } from "../../utils/languageDetector.js"

export function CodeStatusBar({ code, language, line, complexity }) {
  const lineCount = code ? code.split("\n").length : 0
  const bytes = new Blob([code || ""]).size
  const sizeLabel = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`

  return (
    <div className="flex items-center gap-4 px-3 h-7 text-[11px] text-[var(--text-muted)] border-t border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 font-mono">
      <span>Ln {line || 1}</span>
      <span>{lineCount} lines</span>
      <span className="text-[var(--accent-secondary)]">{getLanguageLabel(language)}</span>
      <span>{sizeLabel}</span>
      {complexity && (
        <span className="ml-auto">
          Time {complexity.time} · Space {complexity.space}
        </span>
      )}
    </div>
  )
}
