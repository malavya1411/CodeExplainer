import { useState, useRef, useEffect } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import { Cpu, ArrowLeftRight, Check, RotateCcw, Copy, Download, FileText, ChevronDown, Award, Sparkles, Shield, Eye, HelpCircle } from "lucide-react"
import { useOptimizerStore } from "../../stores/optimizerStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { getLanguageLabel } from "../../utils/languageDetector.js"
import { Button } from "../shared/Button.jsx"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"
import { toast } from "../shared/Toast.jsx"
import { downloadText, downloadOptimizationPDF } from "../../utils/exportGenerator.js"

export function OptimizerWorkspace() {
  const originalCode = useOptimizerStore((s) => s.originalCode)
  const modifiedCode = useOptimizerStore((s) => s.modifiedCode)
  const language = useOptimizerStore((s) => s.language)
  const isOptimizing = useOptimizerStore((s) => s.isOptimizing)
  const activeCategory = useOptimizerStore((s) => s.activeCategory)
  const explanationLevel = useOptimizerStore((s) => s.explanationLevel)
  const appliedOptimizations = useOptimizerStore((s) => s.appliedOptimizations)
  const report = useOptimizerStore((s) => s.report)

  const setFilter = useOptimizerStore((s) => s.setFilter)
  const setExplanationLevel = useOptimizerStore((s) => s.setExplanationLevel)
  const applyOptimization = useOptimizerStore((s) => s.applyOptimization)
  const revertOptimization = useOptimizerStore((s) => s.revertOptimization)
  const applyAll = useOptimizerStore((s) => s.applyAll)
  const revertAll = useOptimizerStore((s) => s.revertAll)

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)

  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const categoryRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  const [viewMode, setViewMode] = useState("diff")

  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)

    const media = window.matchMedia("(min-width: 768px)")
    const listener = (e) => setIsDesktop(e.matches)
    media.addEventListener("change", listener)

    return () => {
      document.removeEventListener("mousedown", onClick)
      media.removeEventListener("change", listener)
    }
  }, [])

  if (isOptimizing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-[var(--bg-primary)] h-full w-full">
        <Cpu size={36} className="animate-spin text-[var(--accent-primary)]" />
        <p className="text-sm font-semibold text-[var(--text-secondary)]">
          Running static AST analysis & refactoring code...
        </p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-[var(--bg-primary)] text-[var(--text-muted)] text-sm h-full w-full">
        <p>No optimization report available. Enter code and click Optimize.</p>
      </div>
    )
  }

  // Filter improvements
  const filteredImprovements = report.improvements.filter((imp) => {
    if (activeCategory === "all") return true
    return imp.category === activeCategory
  })

  // Format category titles
  const categories = [
    { id: "all", label: "All" },
    { id: "performance", label: "Performance" },
    { id: "readability", label: "Readability" },
    { id: "memory", label: "Memory" },
    { id: "security", label: "Security" },
    { id: "best-practices", label: "Best Practices" }
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(modifiedCode)
      toast.success("Optimized code copied to clipboard")
    } catch {
      toast.error("Failed to copy code")
    }
  }

  const handleDownload = () => {
    const ext = language === "java" ? "java" : (language === "python" ? "py" : "js")
    downloadText(`optimized_solution.${ext}`, modifiedCode, "text/plain")
    toast.success("Code downloaded successfully")
  }

  const handleExportMarkdown = () => {
    let md = `# CodeExplainer Optimization Report\n\n`
    md += `## Metrics\n`
    md += `- **Overall Optimization Score**: ${report.score}/100\n`
    md += `- **Performance**: ${report.categories.performance}/100\n`
    md += `- **Readability**: ${report.categories.readability}/100\n`
    md += `- **Maintainability**: ${report.categories.maintainability}/100\n`
    md += `- **Security**: ${report.categories.security}/100\n\n`
    md += `## Original Code\n\`\`\`${language}\n${originalCode}\n\`\`\`\n\n`
    md += `## Optimized Code\n\`\`\`${language}\n${modifiedCode}\n\`\`\`\n\n`
    md += `## Improvements Applied:\n`
    report.improvements.forEach((imp) => {
      const status = appliedOptimizations.includes(imp.id) ? "Applied" : "Not Applied"
      md += `### ${imp.title} (${status})\n`
      md += `- **Category**: ${imp.category}\n`
      md += `- **Impact**: ${imp.impact}\n`
      md += `- **Fix**: \`${imp.optimizedSnippet.trim()}\`\n`
      md += `- **Explanation**: ${imp.explanation.intermediate}\n\n`
    })

    downloadText("optimization-report.md", md, "text/markdown")
    toast.success("Markdown report generated")
  }

  const handleExportPDF = async () => {
    try {
      toast.info("Generating PDF report...")
      await downloadOptimizationPDF({
        originalCode,
        modifiedCode,
        language,
        report,
        appliedOptimizations
      })
      toast.success("PDF report downloaded")
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate PDF report")
    }
  }

  const defineThemeOnMount = (editor, monaco) => {
    monaco.editor.defineTheme("explainer-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "D9A96A" },
        { token: "string", foreground: "9DC7E5" },
        { token: "number", foreground: "D8B25C" },
        { token: "comment", foreground: "6D726D", fontStyle: "italic" },
        { token: "type.identifier", foreground: "89BFA0" }
      ],
      colors: {
        "editor.background": "#151816",
        "editor.foreground": "#F5F4EE",
        "editorLineNumber.foreground": "#2A2F2B",
        "editorLineNumber.activeForeground": "#B5B4AB",
        "editor.lineHighlightBackground": "#1B1F1C",
        "editorGutter.background": "#151816"
      }
    })
    monaco.editor.defineTheme("explainer-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8C472B" },
        { token: "string", foreground: "3E6B4E" },
        { token: "number", foreground: "A87D25" },
        { token: "comment", foreground: "999990", fontStyle: "italic" },
        { token: "type.identifier", foreground: "2D6A4F" }
      ],
      colors: {
        "editor.background": "#FAF9F5",
        "editor.foreground": "#3A3A35",
        "editorLineNumber.foreground": "#D8D1BE",
        "editorLineNumber.activeForeground": "#6B6B63",
        "editor.lineHighlightBackground": "#F3F0E2",
        "editorGutter.background": "#FAF9F5"
      }
    })
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">
      
      {/* Left Panel: Diff view (50% width on desktop, 45vh height on mobile) */}
      <div className="flex flex-col w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[var(--border)] h-[45vh] md:h-full min-h-0 bg-[var(--bg-secondary)]">
        
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-1 shadow-sm shrink-0">
              <button
                onClick={() => setViewMode("diff")}
                className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                  viewMode === "diff"
                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                Comparison
              </button>
              <button
                onClick={() => setViewMode("code")}
                className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                  viewMode === "code"
                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                Final Code
              </button>
            </div>
            <div className="text-[11px] font-semibold bg-[var(--bg-tertiary)] text-[var(--accent-primary)] rounded px-2 py-1.5 border border-[var(--border)] shrink-0">
              {getLanguageLabel(language)}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={applyAll}
              disabled={appliedOptimizations.length === report.improvements.length}
              className="flex items-center gap-1.5 text-xs font-semibold rounded px-2.5 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-[var(--accent-on)] transition-colors cursor-pointer"
            >
              <Check size={13} strokeWidth={2.5} />
              Apply All
            </button>
            <button
              onClick={revertAll}
              disabled={appliedOptimizations.length === 0}
              className="flex items-center gap-1.5 text-xs font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              Revert
            </button>

            <div className="w-px h-5 bg-[var(--border)] mx-1" />

            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
              >
                Export
                <ChevronDown size={13} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 mt-1.5 w-44 premium-card shadow-xl py-1 z-50">
                  <button
                    onClick={() => { setExportOpen(false); handleCopy(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <Copy size={13} /> Copy to Clipboard
                  </button>
                  <button
                    onClick={() => { setExportOpen(false); handleDownload(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <Download size={13} /> Download File
                  </button>
                  <button
                    onClick={() => { setExportOpen(false); handleExportMarkdown(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <FileText size={13} /> Markdown Report
                  </button>
                  <button
                    onClick={() => { setExportOpen(false); handleExportPDF(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <FileText size={13} /> PDF Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Container */}
        <div className="flex-1 min-h-0 relative">
          {viewMode === "diff" ? (
            <DiffEditor
              original={originalCode}
              modified={modifiedCode}
              language={language}
              theme={resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"}
              onMount={defineThemeOnMount}
              options={{
                readOnly: true,
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                renderSideBySide: isDesktop,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
              }}
            />
          ) : (
            <Editor
              value={modifiedCode}
              language={language}
              theme={resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"}
              options={{
                readOnly: true,
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 }
              }}
            />
          )}
        </div>
      </div>

      {/* Right Panel: Scoring & Improvement List (50% width on desktop, remaining height on mobile) */}
      <div className="flex flex-col w-full md:w-1/2 flex-1 md:h-full min-h-0 bg-[var(--bg-primary)] p-4 overflow-y-auto space-y-4">
        
        {/* Scores Card */}
        <Card title="Optimization Score">
          <div className="flex items-center gap-6">
            
            {/* Overall Score Circle */}
            <div className="relative flex items-center justify-center w-24 h-24 shrink-0 rounded-full border-4 border-[var(--accent-primary)] bg-[var(--bg-secondary)] shadow-inner select-none">
              <div className="text-center">
                <span className="text-2xl font-black text-[var(--text-primary)]">{report.score}</span>
                <span className="block text-[8px] uppercase tracking-wider text-[var(--text-muted)] font-extrabold leading-none">Score</span>
              </div>
            </div>

            {/* Categorized Progress Bars */}
            <div className="flex-1 space-y-2">
              <ScoreProgress label="Performance" value={report.categories.performance} />
              <ScoreProgress label="Readability" value={report.categories.readability} />
              <ScoreProgress label="Maintainability" value={report.categories.maintainability} />
              <ScoreProgress label="Security" value={report.categories.security} />
            </div>
          </div>
        </Card>

        {/* Complexity Comparison Card */}
        <Card title="Complexity Comparison">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
              <div className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-wider mb-2">Current Code</div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Time:</span> <span className="font-semibold text-red-500">{report.currentComplexity.time}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Space:</span> <span className="font-semibold text-[var(--text-primary)]">{report.currentComplexity.space}</span></div>
              </div>
            </div>
            <div className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
              <div className="text-[10px] uppercase font-black text-[var(--text-muted)] tracking-wider mb-2">Optimized Code</div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Time:</span> <span className="font-semibold text-[var(--success)]">{report.optimizedComplexity.time}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Space:</span> <span className="font-semibold text-[var(--text-primary)]">{report.optimizedComplexity.space}</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Unified Toolbar for Filters & Depth */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 select-none">
          
          {/* Category Filter Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span className="text-[var(--text-muted)] font-normal">Category:</span>
              <span className="text-[var(--text-primary)] font-bold">
                {categories.find(c => c.id === activeCategory)?.label || "All"}
              </span>
              <ChevronDown size={14} className="text-[var(--text-muted)]" />
            </button>
            
            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 premium-card shadow-xl py-1 z-40">
                {categories.map((c) => {
                  const isActive = activeCategory === c.id
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setFilter(c.id)
                        setCategoryDropdownOpen(false)
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold"
                          : "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {c.label}
                      {isActive && <Check size={12} strokeWidth={3} />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Explanation Depth Segmented Switcher */}
          <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-1 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-primary)] px-2">Depth</span>
            <div className="flex gap-0.5">
              {["beginner", "intermediate", "expert"].map((level) => {
                const isActive = explanationLevel === level
                return (
                  <button
                    key={level}
                    onClick={() => setExplanationLevel(level)}
                    className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Improvement Cards Feed */}
        <div className="space-y-3 pt-1">
          {filteredImprovements.length === 0 ? (
            <div className="text-center text-xs text-[var(--text-muted)] py-6 border border-dashed border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
              No improvements matched for the selected category filter.
            </div>
          ) : (
            filteredImprovements.map((imp) => {
              const isApplied = appliedOptimizations.includes(imp.id)
              return (
                <div
                  key={imp.id}
                  className="premium-card p-5 space-y-3 hover:border-[var(--accent-secondary)] hover:shadow-md hover:-translate-y-0.5"
                >
                  
                  {/* Card Header: Title + Badges */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">{imp.title}</h3>
                      <div className="flex items-center gap-2 select-none">
                        <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border)]">
                          {imp.category}
                        </span>
                        <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                          imp.impact === "High"
                            ? "bg-red-400/10 border-red-400 text-red-500"
                            : (imp.impact === "Medium" ? "bg-yellow-400/10 border-yellow-400 text-yellow-500" : "bg-blue-400/10 border-blue-400 text-blue-500")
                        }`}>
                          {imp.impact} Impact
                        </span>
                      </div>
                    </div>

                    {/* Local Apply/Revert buttons */}
                    <button
                      onClick={() => isApplied ? revertOptimization(imp.id) : applyOptimization(imp.id)}
                      className={`text-xs font-semibold rounded px-2.5 py-1.5 border transition-all cursor-pointer active:scale-95 ${
                        isApplied
                          ? "bg-[color-mix(in_srgb,var(--success)_12%,transparent)] border-[var(--success)] text-[var(--success)] hover:bg-[color-mix(in_srgb,var(--success)_18%,transparent)]"
                          : "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-on)] hover:bg-[var(--accent-hover)]"
                      }`}
                    >
                      {isApplied ? "Applied" : "Apply"}
                    </button>
                  </div>

                  {/* Problem & Recommended Fix */}
                  <div className="space-y-2 text-xs">
                    <div className="text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">Problem:</span> {imp.problem}
                    </div>
                    <div className="text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">Benefit:</span> {imp.benefit}
                    </div>
                    
                    {/* Fix Code Block */}
                    <div className="space-y-1">
                      <span className="font-semibold text-[var(--text-primary)]">Recommended Fix:</span>
                      <pre className="p-2.5 rounded border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-[10px] overflow-x-auto leading-relaxed select-text">
                        {imp.optimizedSnippet}
                      </pre>
                    </div>
                  </div>

                  {/* Expandable Explanation Details */}
                  <div className="border-t border-[var(--border)] pt-2.5 space-y-2 text-xs">
                    <div className="text-[var(--text-secondary)] leading-relaxed">
                      <span className="font-semibold text-[var(--text-primary)]">Explain Changes:</span>{" "}
                      {imp.explanation[explanationLevel]}
                    </div>
                    {imp.tradeoffs && (
                      <div className="text-[var(--text-muted)] leading-relaxed italic">
                        <span className="font-semibold text-[var(--text-secondary)]">Trade-offs:</span> {imp.tradeoffs}
                      </div>
                    )}
                  </div>

                </div>
              )
            })
          )}
        </div>

      </div>

    </div>
  )
}

function ScoreProgress({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs font-semibold text-[var(--text-secondary)]">
        <span>{label}</span>
        <span className="text-[var(--text-primary)]">{value}/100</span>
      </div>
      <div className="h-1.5 w-full rounded bg-[var(--bg-tertiary)] overflow-hidden">
        <div
          className="h-full bg-[var(--accent-primary)] transition-all duration-500 rounded"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
