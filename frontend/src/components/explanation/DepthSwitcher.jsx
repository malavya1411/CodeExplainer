import { motion } from "framer-motion"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { useCommentStore } from "../../stores/commentStore.js"

const OPTIONS = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "expert", label: "Expert" },
]

export function DepthSwitcher() {
  const depth = useExplanationStore((s) => s.depth)
  const setDepth = useExplanationStore((s) => s.setDepth)

  return (
    <div
      role="radiogroup"
      aria-label="Explanation depth"
      className="relative flex rounded-lg bg-[var(--bg-tertiary)] p-1 gap-1"
    >
      {OPTIONS.map((o) => {
        const active = depth === o.id
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            onClick={() => {
              setDepth(o.id)
              const commentStore = useCommentStore.getState()
              commentStore.updateSettings({ depth: o.id })
              const cachedComments = commentStore.commentedCodes
              if (cachedComments && cachedComments[o.id]) {
                useCommentStore.setState({ commentedCode: cachedComments[o.id] })
              }
            }}
            className="relative flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors z-10"
            style={{ color: active ? "var(--accent-on)" : "var(--text-secondary)" }}
          >
            {active && (
              <motion.span
                layoutId="depth-pill"
                className="absolute inset-0 rounded-md bg-[var(--accent-primary)] -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
