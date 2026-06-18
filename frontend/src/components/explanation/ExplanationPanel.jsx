import { Sparkles } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { DepthSwitcher } from "./DepthSwitcher.jsx"
import { TabNavigation } from "./TabNavigation.jsx"
import { OverviewTab } from "./OverviewTab.jsx"
import { StepByStepTab } from "./StepByStepTab.jsx"
import { ChunksTab } from "./ChunksTab.jsx"
import { ArchitectureTab } from "./ArchitectureTab.jsx"
import { ExplorerTab } from "./ExplorerTab.jsx"
import { VariablesTab } from "./VariablesTab.jsx"
import { ComplexityTab } from "./ComplexityTab.jsx"
import { DiagramsTab } from "./DiagramsTab.jsx"
import { CommentPreview } from "./CommentPreview.jsx"
import { MinimapPanel } from "./MinimapPanel.jsx"

export function ExplanationPanel({ complexity }) {
  const explanation = useExplanationStore((s) => s.explanation)
  const activeTab = useExplanationStore((s) => s.activeTab)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const depth = useExplanationStore((s) => s.depth)
  const explanationMode = useExplanationStore((s) => s.explanationMode)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)

  const isAdaptive = explanationMode !== "detailed"

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
              Generating 30s Summary, 5m Overview &amp; Deep Dive explanations
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
                analyze this code and get tailored explanations for 30s Summary, 5m Overview, and
                Deep Dive levels.
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

  // ── Active explanation state ───────────────────────────────────────────────

  // The "Step-by-Step" tab adapts its content based on explanationMode
  const renderStepTab = () => {
    if (explanationMode === "chunk") return <ChunksTab />
    if (explanationMode === "architecture") return <ArchitectureTab />
    if (explanationMode === "explorer") return <ExplorerTab />
    return <StepByStepTab />
  }

  // Adaptive tab label
  const stepTabLabel =
    explanationMode === "chunk"
      ? "Code Sections"
      : explanationMode === "architecture"
      ? "Architecture"
      : explanationMode === "explorer"
      ? "Explorer"
      : "Step-by-Step"

  return (
    <section
      aria-label="Explanation panel"
      className="flex flex-col h-full min-h-0 bg-[var(--bg-primary)]"
    >
      {/* Mode badge (only in adaptive modes) */}
      {isAdaptive && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-1.5 bg-[color-mix(in_srgb,var(--accent-primary)_6%,transparent)] border-b border-[color-mix(in_srgb,var(--accent-primary)_20%,transparent)]">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--accent-primary)" }}
          >
            {explanationMode === "chunk"
              ? "⚡ Chunk Mode — 101–500 lines"
              : explanationMode === "architecture"
              ? "🏗️ Architecture Mode — 501–2000 lines"
              : "🗺️ Codebase Explorer — 2000+ lines"}
          </span>
        </div>
      )}

      {/* Depth switcher + tab bar */}
      <div className="shrink-0 flex flex-col gap-0 border-b border-[var(--border)]">
        <div className="px-4 py-2 bg-[var(--bg-secondary)]">
          <DepthSwitcher />
        </div>
        <TabNavigation adaptiveStepLabel={stepTabLabel} />
      </div>

      {/* Main content area — minimap sidebar + tab content */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Minimap sidebar — only in adaptive modes */}
        {isAdaptive && <MinimapPanel explanation={explanation} />}

        {/* Tab content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {activeTab === "Overview" && (
            <OverviewTab explanation={explanation} complexity={complexity} depth={depth} />
          )}
          {activeTab === "Step-by-Step" && renderStepTab()}
          {activeTab === "Variables" && (
            <VariablesTab explanation={explanation} currentStep={currentStep} depth={depth} />
          )}
          {activeTab === "Complexity" && (
            <ComplexityTab explanation={explanation} complexity={complexity} depth={depth} />
          )}
          {activeTab === "Diagrams" && <DiagramsTab explanation={explanation} />}
          {activeTab === "Comments" && <CommentPreview />}
        </div>
      </div>
    </section>
  )
}
