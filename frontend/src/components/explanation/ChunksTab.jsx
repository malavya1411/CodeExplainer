import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, Zap, Code2, Layers } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"

function FunctionCard({ fn, level }) {
  const complexity = Math.max(1, Math.ceil(fn.lines / 8))
  const complexityColor =
    complexity <= 3
      ? "var(--success)"
      : complexity <= 7
      ? "var(--warning)"
      : "var(--error)"

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Zap size={12} style={{ color: "var(--accent-primary)" }} />
          <span className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate">
            {fn.name}()
          </span>
        </div>
        <span
          className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold"
          style={{
            background: `color-mix(in srgb, ${complexityColor} 12%, transparent)`,
            color: complexityColor,
          }}
        >
          CC:{complexity}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          L{fn.start}–{fn.end}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {fn.lines} line{fn.lines !== 1 ? "s" : ""}
        </span>
      </div>
      {fn.description && (
        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
          {fn.description}
        </p>
      )}
    </div>
  )
}

function ChunkCard({ chunk, index, isActive, onSelect, level }) {
  const [expanded, setExpanded] = useState(isActive)
  const hasFunctions = chunk.functions && chunk.functions.length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className={
        "rounded-xl border transition-all duration-200 overflow-hidden " +
        (isActive
          ? "border-[var(--accent-primary)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-primary)_30%,transparent)]"
          : "border-[var(--border)]")
      }
    >
      {/* Header */}
      <button
        className={
          "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors " +
          (isActive ? "bg-[color-mix(in_srgb,var(--accent-primary)_6%,transparent)]" : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]")
        }
        onClick={() => {
          onSelect(index)
          setExpanded(!expanded)
        }}
      >
        <span className="text-xl leading-none mt-0.5">{chunk.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold"
              style={{ color: isActive ? "var(--accent-primary)" : "var(--text-primary)" }}
            >
              {chunk.label}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              L{chunk.line_start}–{chunk.line_end}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {chunk.lineCount} line{chunk.lineCount !== 1 ? "s" : ""}
            </span>
            {hasFunctions && (
              <Badge type="info" size="sm">
                {chunk.functions.length} fn{chunk.functions.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2">
            {chunk.description}
          </p>
        </div>
        <span className="shrink-0 text-[var(--text-muted)] mt-0.5">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-primary)] space-y-3">
              {/* Code preview */}
              {chunk.preview && chunk.preview.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1.5">
                    Preview
                  </p>
                  <div className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] px-3 py-2 font-mono text-[11px] text-[var(--text-secondary)] space-y-0.5 overflow-x-auto">
                    {chunk.preview.map((line, i) => (
                      <div key={i} className="whitespace-pre truncate">
                        {line}
                      </div>
                    ))}
                    {chunk.lineCount > 3 && (
                      <div className="text-[var(--text-muted)] italic">
                        … {chunk.lineCount - 3} more line{chunk.lineCount - 3 !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Function cards */}
              {hasFunctions && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    Functions
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {chunk.functions.map((fn, j) => (
                      <FunctionCard key={j} fn={fn} level={level} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ChunksTab() {
  const explanation = useExplanationStore((s) => s.explanation)
  const depth = useExplanationStore((s) => s.depth)
  const activeChunkIndex = useExplanationStore((s) => s.activeChunkIndex)
  const selectChunk = useExplanationStore((s) => s.selectChunk)

  const chunks = explanation?.chunks || []
  const functions = explanation?.functions || []

  if (chunks.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">
        No chunks detected.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Layers size={13} />
          <span>{chunks.length} section{chunks.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Zap size={13} />
          <span>{functions.length} function{functions.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Code2 size={13} />
          <span>Click a section to highlight it in the editor</span>
        </div>
      </div>

      {/* Chunk cards */}
      {chunks.map((chunk, i) => (
        <ChunkCard
          key={i}
          chunk={chunk}
          index={i}
          isActive={i === activeChunkIndex}
          onSelect={selectChunk}
          level={depth}
        />
      ))}
    </div>
  )
}
