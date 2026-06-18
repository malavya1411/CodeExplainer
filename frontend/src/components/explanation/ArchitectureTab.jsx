import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, GitBranch, Zap, Box } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { Badge } from "../shared/Badge.jsx"

function ModuleCard({ mod, index, isActive, onSelect, level }) {
  const [expanded, setExpanded] = useState(isActive)
  const hasFunctions = mod.functions && mod.functions.length > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className={
        "rounded-xl border transition-all duration-200 overflow-hidden " +
        (isActive
          ? "border-[var(--accent-primary)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent-primary)_25%,transparent)]"
          : "border-[var(--border)]")
      }
    >
      <button
        className={
          "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors " +
          (isActive
            ? "bg-[color-mix(in_srgb,var(--accent-primary)_6%,transparent)]"
            : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]")
        }
        onClick={() => {
          onSelect(index)
          setExpanded(!expanded)
        }}
      >
        <span className="text-xl leading-none mt-0.5">{mod.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-semibold"
              style={{ color: isActive ? "var(--accent-primary)" : "var(--text-primary)" }}
            >
              {mod.name}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              L{mod.lineStart}–{mod.lineEnd}
            </span>
            {hasFunctions && (
              <Badge type="info" size="sm">
                {mod.functions.length} fn{mod.functions.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mt-1">
            {mod.description}
          </p>
        </div>
        <span className="shrink-0 text-[var(--text-muted)] mt-0.5">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
      </button>

      <AnimatePresence>
        {expanded && hasFunctions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg-primary)]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
                Functions in this module
              </p>
              <div className="space-y-1.5">
                {mod.functions.slice(0, 8).map((fn, i) => {
                  const cc = Math.max(1, Math.ceil(fn.lines / 8))
                  const color = cc <= 3 ? "var(--success)" : cc <= 7 ? "var(--warning)" : "var(--error)"
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Zap size={11} style={{ color: "var(--accent-primary)" }} />
                        <span className="font-mono text-[11px] text-[var(--text-primary)] font-semibold truncate">
                          {fn.name}()
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          L{fn.start}–{fn.end}
                        </span>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            background: `color-mix(in srgb, ${color} 12%, transparent)`,
                            color,
                          }}
                        >
                          CC:{cc}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {mod.functions.length > 8 && (
                  <p className="text-[10px] text-[var(--text-muted)] text-center pt-1">
                    +{mod.functions.length - 8} more function{mod.functions.length - 8 !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ArchitectureTab() {
  const explanation = useExplanationStore((s) => s.explanation)
  const depth = useExplanationStore((s) => s.depth)
  const activeModuleIndex = useExplanationStore((s) => s.activeModuleIndex)
  const selectModule = useExplanationStore((s) => s.selectModule)

  const modules = explanation?.modules || []
  const functions = explanation?.functions || []

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">
        No modules detected.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Box size={13} />
          <span>{modules.length} module{modules.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Zap size={13} />
          <span>{functions.length} function{functions.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <GitBranch size={13} />
          <span>Click a module to highlight it in the editor</span>
        </div>
      </div>

      {/* Data flow hint */}
      {modules.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {modules.slice(0, 6).map((mod, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => selectModule(i)}
                className={
                  "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border transition-colors " +
                  (i === activeModuleIndex
                    ? "border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent-primary)]")
                }
              >
                <span>{mod.icon}</span>
                <span className="max-w-[80px] truncate">{mod.name}</span>
              </button>
              {i < Math.min(5, modules.length - 1) && (
                <span className="text-[var(--text-muted)] text-xs">→</span>
              )}
            </div>
          ))}
          {modules.length > 6 && (
            <span className="text-[10px] text-[var(--text-muted)] shrink-0">
              +{modules.length - 6} more
            </span>
          )}
        </div>
      )}

      {/* Module cards */}
      {modules.map((mod, i) => (
        <ModuleCard
          key={i}
          mod={mod}
          index={i}
          isActive={i === activeModuleIndex}
          onSelect={selectModule}
          level={depth}
        />
      ))}
    </div>
  )
}
