import { useState, useEffect } from "react"
import { Sparkles, Play, Lock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
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

export function ExplanationPanel({ complexity, onAnalyze }) {
  const explanation = useExplanationStore((s) => s.explanation)
  const analyzedCode = useExplanationStore((s) => s.analyzedCode)
  const activeTab = useExplanationStore((s) => s.activeTab)
  const currentStep = useExplanationStore((s) => s.currentStep)
  const depth = useExplanationStore((s) => s.depth)
  const code = useCodeStore((s) => s.code)
  const isAnalyzing = useCodeStore((s) => s.isAnalyzing)

  const [loadingStep, setLoadingStep] = useState(0)

  useEffect(() => {
    if (isAnalyzing) {
      setLoadingStep(0)
      const t1 = setTimeout(() => setLoadingStep(1), 400)
      const t2 = setTimeout(() => setLoadingStep(2), 900)
      const t3 = setTimeout(() => setLoadingStep(3), 1400)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        clearTimeout(t3)
      }
    } else {
      setLoadingStep(0)
    }
  }, [isAnalyzing])

  const codeChanged = explanation && code && analyzedCode && (code.trim() !== analyzedCode.trim())

  // ── Empty / loading state ──────────────────────────────────────────────────
  if (!explanation) {
    return (
      <section
        aria-label="Explanation panel"
        className="flex flex-col h-full items-center justify-center bg-[var(--bg-primary)] overflow-y-auto"
      >
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center gap-6 py-12 px-6 h-full max-w-md mx-auto">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-2xl border border-[var(--accent-primary)]/20 animate-ping opacity-75"
              />
              <div className="absolute inset-0 rounded-2xl border border-t-[var(--accent-primary)] border-transparent animate-spin" />
              <Sparkles size={24} className="text-[var(--accent-primary)] animate-pulse" />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] animate-fade-in">Generating Analysis...</h3>
              <p className="text-xs text-[var(--text-muted)] animate-fade-in">Creating tailored insights for all skill levels</p>
            </div>

            <div className="w-full space-y-3">
              {/* Beginner Card */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                loadingStep >= 1 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                  : loadingStep === 0 
                  ? "bg-[var(--bg-secondary)] border-[var(--accent-primary)]/50 text-[var(--text-primary)] shadow-sm shadow-emerald-500/5" 
                  : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)] opacity-60"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📘</span>
                  <div className="text-left">
                    <div className="font-semibold text-xs">Beginner Explanations</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium">Simple guidance & key terms</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {loadingStep >= 1 ? (
                    <CheckCircle2 size={16} className="text-emerald-500 animate-fade-in" />
                  ) : loadingStep === 0 ? (
                    <RefreshCw size={14} className="animate-spin text-[var(--accent-primary)]" />
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Waiting</span>
                  )}
                </div>
              </div>

              {/* Intermediate Card */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                loadingStep >= 2 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                  : loadingStep === 1 
                  ? "bg-[var(--bg-secondary)] border-[var(--accent-primary)]/50 text-[var(--text-primary)] shadow-sm shadow-emerald-500/5" 
                  : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)] opacity-60"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⚙️</span>
                  <div className="text-left">
                    <div className="font-semibold text-xs">Intermediate Insights</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium">Walkthroughs & variable states</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {loadingStep >= 2 ? (
                    <CheckCircle2 size={16} className="text-emerald-500 animate-fade-in" />
                  ) : loadingStep === 1 ? (
                    <RefreshCw size={14} className="animate-spin text-[var(--accent-primary)]" />
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Waiting</span>
                  )}
                </div>
              </div>

              {/* Expert Card */}
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                loadingStep >= 3 
                  ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" 
                  : loadingStep === 2 
                  ? "bg-[var(--bg-secondary)] border-[var(--accent-primary)]/50 text-[var(--text-primary)] shadow-sm shadow-emerald-500/5" 
                  : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)] opacity-60"
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧠</span>
                  <div className="text-left">
                    <div className="font-semibold text-xs">Expert Analysis</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium">Complexity & optimization</div>
                  </div>
                </div>
                <div className="flex items-center">
                  {loadingStep >= 3 ? (
                    <CheckCircle2 size={16} className="text-emerald-500 animate-fade-in" />
                  ) : loadingStep === 2 ? (
                    <RefreshCw size={14} className="animate-spin text-[var(--accent-primary)]" />
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Waiting</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-6 py-12 max-w-5xl mx-auto h-full w-full">
            {/* Logo / Illustration */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-6">
              <div
                className="absolute inset-0 rounded-2xl rotate-12 opacity-10 bg-[var(--accent-primary)]"
              />
              <div
                className="absolute inset-0 rounded-2xl -rotate-12 opacity-10 bg-[var(--accent-secondary)]"
              />
              <Sparkles size={32} className="relative text-[var(--accent-primary)] animate-pulse" />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Your Code</span>
              </h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl mx-auto">
                Generate AI-powered explanations, execution walkthroughs, complexity analysis, diagrams, variable tracking, and code comments tailored to your skill level.
              </p>
            </div>

            {/* Premium CTA Button */}
            <div className="flex flex-col items-center gap-2 mt-8">
              <button
                onClick={onAnalyze}
                className="relative group flex items-center gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] active:scale-98 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden border border-emerald-500/30"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <Play size={18} fill="currentColor" className="group-hover:translate-x-0.5 transition-transform duration-300" />
                <span>Explain Code</span>
              </button>
              <div className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                Beginner • Intermediate • Expert
              </div>
            </div>

            {/* Keyboard shortcut hint */}
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] bg-[var(--bg-secondary)] rounded-xl px-4 py-2 border border-[var(--border)] mt-4 select-none">
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                Enter
              </kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                Ctrl
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[10px] border border-[var(--border)]">
                Enter
              </kbd>
              <span>to analyze</span>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full max-w-5xl px-6 mt-12">
              {/* Card 1 */}
              <div className="flex flex-col gap-2.5 p-4 premium-card border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm">
                <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <span className="text-sm group-hover:scale-115 transition-transform duration-300">📘</span>
                  <span>Beginner Explanations</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">Simple language and guided learning</div>
              </div>
              
              {/* Card 2 */}
              <div className="flex flex-col gap-2.5 p-4 premium-card border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm">
                <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <span className="text-sm group-hover:rotate-12 transition-transform duration-300">⚙️</span>
                  <span>Intermediate Insights</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">Logic, variables, and flow explained</div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col gap-2.5 p-4 premium-card border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm">
                <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <span className="text-sm group-hover:scale-115 transition-transform duration-300">🧠</span>
                  <span>Expert Analysis</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">Complexity, optimizations, and tradeoffs</div>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col gap-2.5 p-4 premium-card border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm">
                <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <span className="text-sm group-hover:scale-115 transition-transform duration-300">📊</span>
                  <span>Visual Diagrams</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">Understand execution visually</div>
              </div>

              {/* Card 5 */}
              <div className="flex flex-col gap-2.5 p-4 premium-card border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] text-left hover:border-[var(--accent-primary)]/50 transition-all duration-300 group hover:-translate-y-0.5 shadow-sm">
                <div className="font-bold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                  <span className="text-sm group-hover:scale-115 transition-transform duration-300">💬</span>
                  <span>Smart Comments</span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-medium">Generate production-ready documentation</div>
              </div>
            </div>

            {/* Secure Footer */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-12 bg-[var(--bg-secondary)] rounded-xl px-4 py-2 border border-[var(--border)] select-none">
              <Lock size={12} className="text-emerald-500 animate-pulse" />
              <span>Your code is safe and secure. We never store or share your code.</span>
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
      <div className="shrink-0 flex flex-col gap-0 border-b border-[var(--border)] animate-fade-in">
        <div className="px-4 py-2 bg-[var(--bg-secondary)]">
          <DepthSwitcher />
        </div>
        <TabNavigation />
      </div>

      {/* Re-analyze banner */}
      {codeChanged && (
        <div className="mx-4 mt-3 flex items-center justify-between gap-3 px-3.5 py-2.5 border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-500 rounded-xl text-xs select-none animate-slide-down shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span className="font-medium">Code changed. Analysis may be outdated.</span>
          </div>
          <button
            onClick={onAnalyze}
            className="flex items-center gap-1 font-bold text-[10px] uppercase bg-amber-600 text-white rounded-lg px-2.5 py-1.5 hover:bg-amber-700 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={10} /> Re-analyze
          </button>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 animate-fade-in">
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
