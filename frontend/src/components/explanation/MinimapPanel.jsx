import { motion } from "framer-motion"
import { useExplanationStore } from "../../stores/explanationStore.js"

export function MinimapPanel({ explanation }) {
  const mode = explanation?.mode
  const activeChunkIndex = useExplanationStore((s) => s.activeChunkIndex)
  const activeModuleIndex = useExplanationStore((s) => s.activeModuleIndex)
  const activeTreeNodeKey = useExplanationStore((s) => s.activeTreeNodeKey)
  const selectChunk = useExplanationStore((s) => s.selectChunk)
  const selectModule = useExplanationStore((s) => s.selectModule)
  const selectTreeNode = useExplanationStore((s) => s.selectTreeNode)

  if (!explanation || mode === "detailed") return null

  const items =
    mode === "chunk"
      ? explanation.chunks || []
      : mode === "architecture" || mode === "explorer"
      ? explanation.modules || []
      : []

  if (items.length === 0) return null

  const isChunk = mode === "chunk"
  const activeIdx = isChunk ? activeChunkIndex : activeModuleIndex
  const onSelect = isChunk
    ? (i) => selectChunk(i)
    : (i) => selectModule(i)

  const getLines = (item, i) => {
    if (isChunk) return `L${item.line_start}–${item.line_end}`
    return `L${item.lineStart || "?"}–${item.lineEnd || "?"}`
  }

  const getLabel = (item) => item.label || item.name
  const getIcon = (item) => item.icon || "📦"
  const getFuncCount = (item) => (item.functions || []).length

  return (
    <div className="w-44 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-secondary)] overflow-y-auto">
      <div className="px-3 py-2 border-b border-[var(--border)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          {mode === "chunk" ? "Sections" : "Modules"}
        </p>
      </div>
      <ol className="flex-1 py-1">
        {items.map((item, i) => {
          const active = i === activeIdx
          return (
            <li key={i}>
              <button
                onClick={() => onSelect(i)}
                className={
                  "w-full text-left px-3 py-2 flex flex-col gap-0.5 transition-colors border-l-2 " +
                  (active
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_8%,transparent)] border-l-[var(--accent-primary)]"
                    : "border-l-transparent hover:bg-[var(--bg-tertiary)]")
                }
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-[13px] leading-none">{getIcon(item)}</span>
                  <span
                    className="text-[11px] font-medium leading-tight truncate"
                    style={{ color: active ? "var(--accent-primary)" : "var(--text-primary)" }}
                  >
                    {getLabel(item)}
                  </span>
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono ml-5">
                  {getLines(item, i)}
                </span>
                {getFuncCount(item) > 0 && (
                  <span className="text-[10px] text-[var(--text-muted)] ml-5">
                    {getFuncCount(item)} fn{getFuncCount(item) !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
