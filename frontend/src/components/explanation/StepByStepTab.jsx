import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Info } from "lucide-react"
import { useExplanationStore, getActiveState } from "../../stores/explanationStore.js"
import { StepControls } from "./StepControls.jsx"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"

export function StepByStepTab() {
  const explanation = useExplanationStore((s) => s.explanation)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const goToStep = useExplanationStore((s) => s.goToStep)
  const depth = useExplanationStore((s) => s.depth)
  const steps = explanation.execution_steps
  const step = steps[currentStep]
  const activeState = getActiveState(explanation, currentStep)
  const newKeys = Object.keys(step?.state_changes || {})

  return (
    <div className="space-y-4">
      <Card accent={false} className="hover:translate-y-0">
        <StepControls />
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Card title={`Step ${step.step}: ${step.title}`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge type="info" size="sm">
                Line {step.line}
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  What happens
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed">{step.what}</p>
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-1">
                  Why it matters
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.why}</p>
              </div>
              {newKeys.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {newKeys.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 rounded bg-[color-mix(in_srgb,var(--success)_15%,transparent)] px-2 py-1 text-xs font-mono"
                      style={{ color: "var(--success)" }}
                    >
                      {k} <ArrowRight size={11} /> {step.state_changes[k]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card title="Current State">
        {Object.keys(activeState).length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Info size={14} /> No variables initialized yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(activeState).map(([k, v]) => {
              const isNew = newKeys.includes(k)
              return (
                <div
                  key={k}
                  className="rounded bg-[var(--bg-tertiary)] px-2.5 py-2 border border-[var(--border)]"
                >
                  <div className="text-[11px] text-[var(--text-muted)] font-mono">{k}</div>
                  <div
                    className={"text-sm font-mono font-semibold text-[var(--text-primary)] " + (isNew ? "animate-value-flash" : "")}
                  >
                    {v}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="All Steps" accent={false}>
        <ol className="space-y-1">
          {steps.map((s, i) => (
            <li key={s.step}>
              <button
                onClick={() => goToStep(i)}
                className={
                  "flex items-start gap-2 w-full text-left rounded px-2 py-1.5 text-xs transition-colors border-l-2 " +
                  (i === currentStep
                    ? "bg-[var(--bg-tertiary)] border-l-[var(--accent-primary)] text-[var(--text-primary)]"
                    : "border-l-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]")
                }
              >
                <span className="font-mono text-[var(--text-muted)] shrink-0">{s.step}.</span>
                <span>{s.description}</span>
              </button>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  )
}
