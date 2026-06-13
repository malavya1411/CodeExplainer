import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Activity, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import { ratingColor } from "../../utils/complexityAnalyzer.js"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { Tooltip } from "../shared/IconButton.jsx"

export function ComplexityOverlay({ complexity }) {
  const [expanded, setExpanded] = useState(true)
  const setActiveTab = useExplanationStore((s) => s.setActiveTab)
  const constraintsRef = useRef(null)

  if (!complexity) return null
  const color = ratingColor(complexity.rating)

  return (
    <div ref={constraintsRef} className="absolute inset-0 pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        className="pointer-events-auto absolute bottom-3 left-3 w-56 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] shadow-xl overflow-hidden"
      >
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-[var(--border)] cursor-grab active:cursor-grabbing">
          <GripVertical size={13} className="text-[var(--text-muted)]" />
          <Activity size={13} style={{ color }} />
          <span className="text-[11px] font-semibold text-[var(--text-primary)] flex-1">
            Complexity
          </span>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse" : "Expand"}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {expanded && (
          <div className="p-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Metric label="Time" value={complexity.time} color={color} hint="Big-O time complexity — how runtime grows with input size n" />
              <Metric label="Space" value={complexity.space} color={color} hint="Big-O space complexity — extra memory used relative to n" />
            </div>
            <Tooltip content="Cyclomatic complexity — number of independent paths through the code" position="top">
              <div className="flex items-center justify-between rounded bg-[var(--bg-tertiary)] px-2 py-1.5 w-full">
                <span className="text-[11px] text-[var(--text-secondary)]">Cyclomatic</span>
                <span className="text-[11px] font-mono font-bold text-[var(--text-primary)]">
                  {complexity.cyclomatic}
                </span>
              </div>
            </Tooltip>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function Metric({ label, value, color, hint }) {
  return (
    <Tooltip content={hint} position="top">
      <div className="rounded bg-[var(--bg-tertiary)] px-2 py-1.5 w-full">
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{label}</div>
        <div className="text-xs font-mono font-bold" style={{ color }}>
          {value}
        </div>
      </div>
    </Tooltip>
  )
}
