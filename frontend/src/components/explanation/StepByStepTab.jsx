import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Layers, GitPullRequest, ArrowRight, Activity, Terminal } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { Badge } from "../shared/Badge.jsx"

function getBlockIcon(type) {
  switch (type) {
    case "class": return "🏫"
    case "function": return "ƒ"
    case "helper_function": return "⚙️"
    case "recursion": return "🌀"
    case "loop": return "↻"
    case "conditional": return "⌥"
    case "switch": return "🔀"
    case "api": return "⇄"
    case "error_handling": return "🛡️"
    case "return": return "↩"
    case "variable": return "⛃"
    default: return "⬡"
  }
}

function BlockVisualization({ block }) {
  const t = block.type
  const title = block.title ? block.title.toLowerCase() : ""

  if (title.includes("decision") || t === "conditional" || t === "switch") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <GitPullRequest size={11} className="text-[var(--accent-primary)]" />
          <span>Visual Decision Tree</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] shadow-inner">
          <div className="font-bold text-emerald-600 dark:text-emerald-500 mb-1 flex items-center gap-1.5">
            <span>🎯 Target evaluation?</span>
          </div>
          <div className="pl-4 border-l border-[var(--border)] space-y-2 mt-2">
            <div className="text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">├─</span> Yes/Matches ➔ <span className="text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded">Execute action / Return index</span>
            </div>
            <div className="text-[var(--text-primary)]">
              <span className="text-[var(--text-muted)]">└─</span> No/Otherwise
              <div className="pl-4 border-l border-[var(--border)] mt-1.5 space-y-1.5">
                <div>
                  <span className="text-[var(--text-muted)]">├─</span> Case A ➔ <span className="text-blue-500 font-medium bg-blue-500/10 px-1 rounded">Narrow left boundary</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">└─</span> Case B ➔ <span className="text-purple-500 font-medium bg-purple-500/10 px-1 rounded">Narrow right boundary</span>
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
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Activity size={11} className="text-[var(--accent-primary)]" />
          <span>Execution Loop Tracker</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3.5 bg-[var(--bg-tertiary)] space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
            <span>[left] index 0</span>
            <span>[mid] probe</span>
            <span>[right] index n-1</span>
          </div>
          <div className="flex items-center justify-between h-5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full border border-[var(--border)] px-3 text-[10px] text-[var(--text-primary)] font-bold">
            <span className="text-emerald-500 font-mono">0</span>
            <span className="text-amber-500 font-mono">midpoint</span>
            <span className="text-blue-500 font-mono">length - 1</span>
          </div>
          <div className="text-center text-[10px] text-[var(--text-muted)] italic">
            Search boundary is halved at each iteration step.
          </div>
        </div>
      </div>
    )
  }

  if (t === "recursion") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Layers size={11} className="text-[var(--accent-primary)]" />
          <span>Call Stack Frames</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5 shadow-inner">
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-center py-1.5 rounded-lg text-[10px] font-bold">
            Active Frame: base case reached ➔ returns
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-center py-1.5 rounded-lg text-[10px] opacity-80 flex items-center justify-center gap-1">
            <span>Frame d-1: sub-problem solver</span>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] text-center py-1.5 rounded-lg text-[10px] opacity-60">
            Frame 0: original call context
          </div>
        </div>
      </div>
    )
  }

  if (t === "helper_function") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <ArrowRight size={11} className="text-[var(--accent-primary)]" />
          <span>Modular Subroutine Interface</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] flex items-center justify-between gap-1 shadow-inner">
          <div className="text-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-2 flex-1 max-w-[90px]">
            <div className="font-bold text-[var(--text-primary)]">Caller</div>
            <div className="text-[9px] text-[var(--text-muted)] mt-0.5">Main code</div>
          </div>
          <span className="text-[var(--text-muted)] font-bold text-sm">➔</span>
          <div className="text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2 flex-1 text-emerald-500 max-w-[100px]">
            <div className="font-bold">Helper</div>
            <div className="text-[9px] text-emerald-600 mt-0.5">Subroutine</div>
          </div>
          <span className="text-[var(--text-muted)] font-bold text-sm">➔</span>
          <div className="text-center bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-2 flex-1 max-w-[90px]">
            <div className="font-bold text-[var(--text-primary)]">Return</div>
            <div className="text-[9px] text-[var(--text-muted)] mt-0.5">Result value</div>
          </div>
        </div>
      </div>
    )
  }

  if (t === "api") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Layers size={11} className="text-[var(--accent-primary)]" />
          <span>API Client-Server Cycle</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-2 shadow-inner">
          <div className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg p-2 border border-[var(--border)] text-[10px]">
            <span className="font-bold text-blue-500">CLIENT</span>
            <span className="text-[9px] text-[var(--text-muted)]">Request (GET / POST) ➔</span>
            <span className="font-bold text-emerald-500">SERVER</span>
          </div>
          <div className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg p-2 border border-[var(--border)] text-[10px]">
            <span className="font-bold text-blue-500">CLIENT</span>
            <span className="text-[9px] text-[var(--text-muted)]">◀ Response (Status 200 OK)</span>
            <span className="font-bold text-emerald-500">SERVER</span>
          </div>
        </div>
      </div>
    )
  }

  if (t === "error_handling") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Terminal size={11} className="text-[var(--accent-primary)]" />
          <span>Exception Boundary Handler</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 font-bold px-2 py-0.5 rounded text-[10px]">TRY BLOCK</span>
            <span className="text-[var(--text-muted)] text-[10px]">Run operations</span>
          </div>
          <div className="pl-3 border-l-2 border-dashed border-[var(--border)] space-y-1.5">
            <div className="text-[10px] text-red-500 flex items-center gap-1.5">
              <span>├─</span> ⚠️ Error thrown ➔ <span className="font-bold bg-red-500/10 px-1.5 py-0.5 rounded">CATCH (Recover)</span>
            </div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1.5">
              <span>└─</span> ✓ Always run ➔ <span className="font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">FINALLY (Cleanup)</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (title.includes("midpoint") || (t === "variable" && title.includes("midpoint"))) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Terminal size={11} className="text-[var(--accent-primary)]" />
          <span>Midpoint Calculation</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-2 shadow-inner">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-muted)]">JS Formula:</span>
            <span className="text-[var(--text-primary)] font-bold bg-[var(--bg-secondary)] border border-[var(--border)] px-1.5 py-0.5 rounded">floor((left + right) / 2)</span>
          </div>
          <div className="h-px bg-[var(--border)]" />
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-muted)]">Overflow safe:</span>
            <span className="text-emerald-500 font-bold bg-[var(--bg-secondary)] border border-[var(--border)] px-1.5 py-0.5 rounded">left + ((right - left) &gt;&gt; 1)</span>
          </div>
        </div>
      </div>
    )
  }

  if (title.includes("boundary") || title.includes("pointer") || title.includes("initial") || (t === "variable" && variables_affected?.length > 1)) {
    const vars = block.variables_affected || []
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Layers size={11} className="text-[var(--accent-primary)]" />
          <span>Local Pointer Binding</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5 shadow-inner">
          {vars.map((v, i) => (
            <div key={v} className="flex justify-between items-center text-[10px]">
              <span className={i === 0 ? "text-emerald-500 font-bold" : "text-blue-500 font-bold"}>{v}</span>
              <span className="text-[var(--text-muted)]">➔</span>
              <span className="font-semibold text-[var(--text-primary)]">{i === 0 ? "Start boundary (0)" : "End boundary (length - 1)"}</span>
            </div>
          ))}
          {vars.length === 0 && (
            <div className="text-center text-[9px] text-[var(--text-muted)]">Initializes workspace range bounds.</div>
          )}
        </div>
      </div>
    )
  }

  if (t === "function" || title.includes("function")) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <ArrowRight size={11} className="text-[var(--accent-primary)]" />
          <span>Method Signature Interface</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5 shadow-inner">
          <div className="flex justify-between text-[10px]">
            <span className="text-[var(--text-muted)]">Input parameters:</span>
            <span className="text-[var(--text-primary)] font-bold">{block.variables_affected?.join(", ") || "arguments"}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--border)] pt-1 text-[10px]">
            <span className="text-[var(--text-muted)]">Return type:</span>
            <span className="text-emerald-500 font-bold">result value / sentinel</span>
          </div>
        </div>
      </div>
    )
  }

  if (t === "return" || title.includes("failure") || title.includes("return")) {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Terminal size={11} className="text-[var(--accent-primary)]" />
          <span>Exit Scope Return</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1.5 shadow-inner">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-muted)]">Exit status:</span>
            <span className={title.includes("failure") ? "text-red-500 font-bold bg-red-500/10 px-1 rounded" : "text-emerald-500 font-bold bg-emerald-500/10 px-1 rounded"}>
              {title.includes("failure") ? "Failure (Not Found)" : "Success (Finished)"}
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-[var(--border)] pt-1 text-[10px]">
            <span className="text-[var(--text-muted)]">Return Value:</span>
            <span className="font-bold text-[var(--text-primary)]">{title.includes("failure") ? "-1 (Sentinel)" : "computed index"}</span>
          </div>
        </div>
      </div>
    )
  }

  // Fallback Variable initialization
  if (t === "variable") {
    return (
      <div className="mt-3 space-y-2 select-none">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
          <Layers size={11} className="text-[var(--accent-primary)]" />
          <span>Stack Variable Allocation</span>
        </div>
        <div className="font-mono text-[11px] border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-tertiary)] space-y-1 shadow-inner grid grid-cols-2 gap-2 text-center">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-1.5">
            <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Storage</div>
            <div className="font-bold text-[10px] text-[var(--text-primary)] mt-0.5">Stack Frame</div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-1.5">
            <div className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider">Access</div>
            <div className="font-bold text-[10px] text-emerald-500 mt-0.5">Local Scope</div>
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
        const icon = getBlockIcon(block.type)

        return (
          <div
            key={block.id}
            onClick={() => {
              if (isActive) {
                setActiveBlockIndex(-1)
              } else {
                setActiveBlockIndex(idx)
              }
            }}
            className={`premium-card border text-left p-4 cursor-pointer transition-all duration-300 ${
              isActive
                ? "border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-md shadow-[var(--accent-primary)]/5"
                : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--text-muted)] hover:shadow-sm"
            }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2">
                <span className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                  isActive 
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20" 
                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)]"
                }`}>
                  {icon}
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
