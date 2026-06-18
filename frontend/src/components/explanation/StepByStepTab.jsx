import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { Badge } from "../shared/Badge.jsx"

function BlockVisualization({ block }) {
  const t = block.type
  const title = block.title.toLowerCase()

  if (title.includes("decision") || t === "conditional") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Visual Decision Tree</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)]">
          <div className="font-bold text-emerald-600 dark:text-emerald-500 mb-1 flex items-center gap-1.5">
            <span>🎯 target found?</span>
          </div>
          <div className="pl-4 border-l border-[var(--border)] space-y-1 mt-1.5">
            <div className="text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">├─</span> Yes → <span className="text-emerald-500 font-bold">return index</span>
            </div>
            <div className="text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">└─</span> No
              <div className="pl-4 border-l border-[var(--border)] mt-1 space-y-1">
                <div>
                  <span className="text-[var(--text-muted)]">├─</span> target larger → <span className="text-blue-500 font-medium">move left boundary</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">└─</span> target smaller → <span className="text-purple-500 font-medium">move right boundary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (title.includes("loop") || t === "loop") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Execution Flow</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-1 text-[10px]">
            <span>[left]</span>
            <span>[mid]</span>
            <span>[right]</span>
          </div>
          <div className="flex items-center justify-between h-5 bg-emerald-500/10 rounded-full border border-emerald-500/20 px-2 text-[10px] text-emerald-600 font-bold">
            <span>0</span>
            <span>2</span>
            <span>4</span>
          </div>
          <div className="text-center text-[10px] text-[var(--text-muted)] mt-1">
            Search range is halved at each step
          </div>
        </div>
      </div>
    )
  }

  if (title.includes("midpoint") || (t === "variable" && title.includes("midpoint"))) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Calculation</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-2">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-muted)]">Formula:</span>
            <span className="text-[var(--text-primary)] font-bold">floor((left + right) / 2)</span>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-muted)]">Probed index:</span>
            <span className="text-emerald-500 font-bold">mid</span>
          </div>
        </div>
      </div>
    )
  }

  if (title.includes("boundary") || title.includes("pointer") || title.includes("initial")) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Pointers</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-emerald-500 font-semibold">left</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="font-semibold text-[var(--text-primary)]">0 (Start)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-500 font-semibold">right</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="font-semibold text-[var(--text-primary)]">length - 1 (End)</span>
          </div>
        </div>
      </div>
    )
  }

  if (t === "function" || title.includes("function")) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Interface Contract</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Input parameters:</span>
            <span className="text-[var(--text-primary)] font-semibold">nums, target</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-1">
            <span className="text-[var(--text-muted)]">Return value:</span>
            <span className="text-emerald-500 font-bold">index / -1</span>
          </div>
        </div>
      </div>
    )
  }

  if (t === "return" || title.includes("failure") || title.includes("return")) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Exit Result</div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-red-500 font-bold">not found</span>
            <span className="text-[var(--text-muted)]">→</span>
            <span className="font-bold text-[var(--text-primary)]">-1 (Sentinel)</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function StepByStepTab() {
  const explanation = useExplanationStore((s) => s.explanation)
  const activeBlockIndex = useExplanationStore((s) => s.activeBlockIndex)
  const setActiveBlockIndex = useExplanationStore((s) => s.setActiveBlockIndex)
  const depth = useExplanationStore((s) => s.depth)

  if (!explanation || !explanation.blocks) {
    return (
      <div className="text-center py-6 text-sm text-[var(--text-muted)] select-none">
        No logical blocks analyzed yet.
      </div>
    )
  }

  const blocks = explanation.blocks

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        const isActive = idx === activeBlockIndex
        const hasVariables = block.variables_affected && block.variables_affected.length > 0
        const explanationText = block[depth] || block._displayText || ""

        return (
          <div
            key={block.id}
            onClick={() => setActiveBlockIndex(idx)}
            className={`premium-card border text-left p-4 cursor-pointer transition-all duration-300 ${
              isActive
                ? "border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-md shadow-[var(--accent-primary)]/5"
                : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] hover:shadow-sm"
            }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold ${
                  isActive 
                    ? "bg-[var(--accent-primary)] text-[var(--accent-on)]" 
                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                }`}>
                  {idx + 1}
                </span>
                <h4 className={`text-xs font-bold transition-colors ${
                  isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
                }`}>
                  {block.title}
                </h4>
              </div>
              <Badge type={isActive ? "primary" : "outline"} size="sm">
                Lines {block.line_start}{block.line_start !== block.line_end ? `-${block.line_end}` : ""}
              </Badge>
            </div>

            {/* Expandable details */}
            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden mt-3 border-t border-[var(--border)] pt-3.5 space-y-3.5"
                >
                  {/* Purpose */}
                  {block.purpose && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                        Purpose
                      </div>
                      <p className="text-xs font-semibold text-[var(--text-primary)] leading-relaxed mt-0.5">
                        {block.purpose}
                      </p>
                    </div>
                  )}

                  {/* Analogy (for beginner/intermediate) */}
                  {block.analogy && depth !== "expert" && (
                    <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <HelpCircle size={14} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Analogy: </span>
                        {block.analogy}
                      </div>
                    </div>
                  )}

                  {/* Detailed Explanation */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {depth === "beginner" ? "How it works" : depth === "intermediate" ? "Logic Details" : "Implementation Details"}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                      {explanationText}
                    </p>
                  </div>

                  {/* Variables involved */}
                  {hasVariables && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                        Variables involved
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {block.variables_affected.map((v) => (
                          <span
                            key={v}
                            className="font-mono text-[10px] bg-[var(--bg-tertiary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[var(--text-primary)] font-semibold"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Concepts */}
                  {block.key_concepts && block.key_concepts.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                        Key Concepts
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {block.key_concepts.map((c) => (
                          <Badge key={c} type="outline" size="sm">
                            {c}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Block Visualization */}
                  <BlockVisualization block={block} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
