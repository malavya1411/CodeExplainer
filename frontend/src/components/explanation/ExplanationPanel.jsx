import { Sparkles } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { DepthSwitcher } from "./DepthSwitcher.jsx"
import { TabNavigation } from "./TabNavigation.jsx"
import { OverviewTab } from "./OverviewTab.jsx"
import { StepByStepTab } from "./StepByStepTab.jsx"
import { VariablesTab } from "./VariablesTab.jsx"
import { ComplexityTab } from "./ComplexityTab.jsx"
import { DiagramsTab } from "./DiagramsTab.jsx"
import { CommentPreview } from "./CommentPreview.jsx"

export function ExplanationPanel({ complexity }) {
  const explanation = useExplanationStore((s) => s.explanation)
  const activeTab = useExplanationStore((s) => s.activeTab)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const depth = useExplanationStore((s) => s.depth)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)

  // ── Empty / loading state ──────────────────────────────────────────────────
  if (!explanation) {
    return (
      <section
        aria-label="Explanation panel"
        className="flex flex-col h-full items-center justify-center bg-[var(--bg-primary)]"
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-4 text-center px-8">
            <div className="relative w-14 h-14">
              <div
                className="absolute inset-0 rounded-full border-2 border-[var(--accent-primary)] opacity-30"
                style={{ animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-t-[var(--accent-primary)] border-transparent animate-spin" />
              <Sparkles
                size={22}
                className="absolute inset-0 m-auto text-[var(--accent-primary)]"
              />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Analyzing code…</p>
            <p className="text-xs text-[var(--text-muted)]">
              Generating Beginner, Intermediate &amp; Expert explanations
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center px-10 max-w-sm">
            {/* Decorative icon cluster */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-2xl rotate-12 opacity-10"
                style={{ background: "var(--accent-primary)" }}
              />
              <div
                className="absolute inset-0 rounded-2xl -rotate-12 opacity-10"
                style={{ background: "var(--accent-secondary)" }}
              />
              <Sparkles size={28} className="relative text-[var(--accent-primary)]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-[var(--text-primary)]">
                Ready to Explain
              </p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Click{" "}
                <span className="font-semibold text-[var(--accent-primary)]">Explain</span> to
                analyze this code and get tailored explanations for Beginner, Intermediate, and
                Expert levels.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-lg px-3 py-2 border border-[var(--border)]">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                Enter
              </kbd>
              <span>to analyze instantly</span>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section
      aria-label="Explanation panel"
      className="flex flex-col h-full min-h-0 bg-[var(--bg-primary)]"
    >
      {/* Depth switcher + tab bar */}
      <div className="shrink-0 flex flex-col gap-0 border-b border-[var(--border)]">
        <div className="px-4 py-2 bg-[var(--bg-secondary)]">
          <DepthSwitcher />
        </div>
        <TabNavigation />
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {activeTab === "Overview" && (
          <OverviewTab explanation={explanation} complexity={complexity} depth={depth} />
        )}
        {activeTab === "Step-by-Step" && <StepByStepTab />}
        {activeTab === "Variables" && (
          <VariablesTab explanation={explanation} currentStep={currentStep} depth={depth} />
        )}
        {activeTab === "Complexity" && (
          <ComplexityTab explanation={explanation} complexity={complexity} depth={depth} />
        )}
        {activeTab === "Diagrams" && <DiagramsTab explanation={explanation} />}
        {activeTab === "Comments" && <CommentPreview />}
      </div>
    </section>
  )
}
