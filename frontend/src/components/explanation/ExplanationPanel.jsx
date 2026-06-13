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

  if (!explanation) {
    return (
      <section
        aria-label="Explanation panel"
        className="flex flex-col h-full items-center justify-center bg-[var(--bg-primary)] text-[var(--text-muted)] text-sm gap-2"
      >
        <p>Paste or upload code, then click Explain.</p>
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
          <VariablesTab explanation={explanation} currentStep={currentStep} />
        )}
        {activeTab === "Complexity" && (
          <ComplexityTab explanation={explanation} complexity={complexity} />
        )}
        {activeTab === "Diagrams" && <DiagramsTab explanation={explanation} />}
        {activeTab === "Comments" && <CommentPreview />}
      </div>
    </section>
  )
}
