import { Sparkles, Play, BookOpen, Settings2, Brain, BarChart3, MessageSquare } from "lucide-react"
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

// Feature card accent colours
const FEATURE_COLORS = ["#7ed8a4", "#7baee8", "#b48ee8", "#e88e7b", "#e8c87b"]
function getFeatureColor(i) { return FEATURE_COLORS[i % FEATURE_COLORS.length] }

export function ExplanationPanel({ complexity, onAnalyze }) {
  const explanation = useExplanationStore((s) => s.explanation)
  const activeTab = useExplanationStore((s) => s.activeTab)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const depth = useExplanationStore((s) => s.depth)
  const explanationMode = useExplanationStore((s) => s.explanationMode)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)

  const isAdaptive = explanationMode !== "detailed"

  // ── Feature cards shown in the hero ──────────────────────────────────────
  const FEATURES = [
    { Icon: BookOpen,      title: "Beginner\nExplanations", desc: "Simple language and guided learning" },
    { Icon: Settings2,     title: "Intermediate\nInsights",  desc: "Logic, variables, and flow explained" },
    { Icon: Brain,         title: "Expert\nAnalysis",        desc: "Complexity, optimizations, and tradeoffs" },
    { Icon: BarChart3,     title: "Visual\nDiagrams",        desc: "Understand execution visually" },
    { Icon: MessageSquare, title: "Smart\nComments",         desc: "Generate production-ready documentation" },
  ]

  // ── Empty / loading state ──────────────────────────────────────────────────
  if (!explanation) {
    return (
      <section
        aria-label="Explanation panel"
        className="flex flex-col h-full bg-[var(--bg-primary)] overflow-y-auto"
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-8">
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
          <div className="flex flex-col items-center justify-between flex-1 px-6 py-10 gap-10 max-w-xl mx-auto w-full">

            {/* ── Hero ── */}
            <div className="flex flex-col items-center gap-6 text-center">

              {/* Icon with floating sparkle dots */}
              <div className="relative w-28 h-28 flex items-center justify-center select-none">
                {/* Decorative dots */}
                {[
                  { top: "4px",  left:  "50%",  size: 5, delay: "0s" },
                  { top: "12px", right: "10px", size: 4, delay: "0.4s" },
                  { top: "50%",  right: "2px",  size: 3, delay: "0.8s" },
                  { bottom:"10px", right:"14px", size: 5, delay: "0.2s" },
                  { top: "30%",  left:  "4px",  size: 3, delay: "0.6s" },
                ].map((d, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: d.size, height: d.size,
                      top: d.top, left: d.left, right: d.right, bottom: d.bottom,
                      background: "var(--accent-primary)",
                      opacity: 0.6,
                      animation: `pulse 2s ${d.delay} ease-in-out infinite`,
                    }}
                  />
                ))}

                {/* Icon box */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                  style={{ background: "color-mix(in srgb, var(--accent-primary) 18%, var(--bg-secondary))" }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "color-mix(in srgb, var(--accent-primary) 10%, transparent)",
                      filter: "blur(10px)",
                    }}
                  />
                  <Sparkles size={36} className="relative" style={{ color: "var(--accent-primary)" }} />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h2 className="font-display text-section tracking-tight leading-tight">
                  <span className="text-[var(--text-primary)]">Understand </span>
                  <span style={{ color: "var(--accent-primary)" }}>Your Code</span>
                </h2>
                <p className="text-body font-body text-[var(--text-muted)] leading-relaxed max-w-sm">
                  Generate AI-powered explanations, step-by-step walkthroughs,
                  complexity analysis, diagrams, and smart comments tailored
                  to your skill level.
                </p>
              </div>

              {/* CTA button */}
              <div className="flex flex-col items-center gap-3">
                <button
                  id="hero-explain-btn"
                  onClick={onAnalyze}
                  className="premium-btn-primary flex items-center gap-2.5 px-8 py-3.5 text-sm font-black uppercase tracking-wider transition-all duration-150"
                  style={{
                    background: "var(--accent-primary)",
                    color: "var(--accent-on)",
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  Explain Code
                </button>

                {/* Keyboard hint */}
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">Enter</kbd>
                  <span>or</span>
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">Ctrl</kbd>
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">Enter</kbd>
                  <span>to analyze</span>
                </div>
              </div>
            </div>

            {/* ── Feature cards ── */}
            <div className="grid grid-cols-5 gap-2 w-full">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-center transition-all duration-150"
                  style={{
                    borderWidth: "var(--border-width, 1px)",
                    borderStyle: "solid",
                    borderColor: "var(--border)",
                    boxShadow: "var(--card-shadow-sm, none)",
                    background: getFeatureColor(i) + "18",
                  }}
                >
                  <f.Icon
                    size={24}
                    strokeWidth={1.6}
                    style={{ color: getFeatureColor(i) }}
                  />
                  <p
                    className="text-caption font-body font-black leading-tight whitespace-pre-line uppercase tracking-wide"
                    style={{ color: getFeatureColor(i) }}
                  >
                    {f.title}
                  </p>
                  <p className="text-[10px] font-body text-[var(--text-muted)] leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* ── Security note ── */}
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <span style={{ color: "var(--success)" }}>✓</span>
              Your code is safe and secure. We never store or share your code.
            </p>

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
