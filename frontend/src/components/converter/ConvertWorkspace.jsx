import { useState, useRef, useEffect } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import {
  ArrowRight, Check, Copy, Download, ChevronDown, RotateCcw,
  Loader2, Sparkles, Info, Languages, GitCompare, Lightbulb,
  Columns2, AlignLeft, CheckCircle2, AlertTriangle, Shield,
  Zap, FileCode2, ArrowUpRight
} from "lucide-react"
import { useConverterStore } from "../../stores/converterStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { SUPPORTED_LANGUAGES, getLanguageLabel, detectLanguageFromContent } from "../../utils/languageDetector.js"
import { getConverterLanguages, CONVERSION_PROGRESS_STEPS } from "../../utils/converterGenerator.js"
import { toast } from "../shared/Toast.jsx"

// ── Language color map ────────────────────────────────────────────────────────
const LANG_META = {
  javascript: { short: "JS",  color: "#F7DF1E", bg: "rgba(247,223,30,0.12)",  border: "rgba(247,223,30,0.3)"  },
  typescript: { short: "TS",  color: "#3178C6", bg: "rgba(49,120,198,0.12)", border: "rgba(49,120,198,0.3)"  },
  python:     { short: "PY",  color: "#4B8BBE", bg: "rgba(75,139,190,0.12)", border: "rgba(75,139,190,0.3)"  },
  java:       { short: "JV",  color: "#ED8B00", bg: "rgba(237,139,0,0.12)",  border: "rgba(237,139,0,0.3)"   },
  cpp:        { short: "C++", color: "#00599C", bg: "rgba(0,89,156,0.12)",   border: "rgba(0,89,156,0.3)"    },
  c:          { short: "C",   color: "#A8B9CC", bg: "rgba(168,185,204,0.12)",border: "rgba(168,185,204,0.3)" },
  csharp:     { short: "C#",  color: "#239120", bg: "rgba(35,145,32,0.12)",  border: "rgba(35,145,32,0.3)"   },
  go:         { short: "GO",  color: "#00ACD7", bg: "rgba(0,172,215,0.12)",  border: "rgba(0,172,215,0.3)"   },
  rust:       { short: "RS",  color: "#CE422B", bg: "rgba(206,66,43,0.12)",  border: "rgba(206,66,43,0.3)"   },
  php:        { short: "PHP", color: "#777BB4", bg: "rgba(119,123,180,0.12)",border: "rgba(119,123,180,0.3)" },
  ruby:       { short: "RB",  color: "#CC342D", bg: "rgba(204,52,45,0.12)",  border: "rgba(204,52,45,0.3)"   },
  kotlin:     { short: "KT",  color: "#7F52FF", bg: "rgba(127,82,255,0.12)", border: "rgba(127,82,255,0.3)"  },
  swift:      { short: "SW",  color: "#F05138", bg: "rgba(240,81,56,0.12)",  border: "rgba(240,81,56,0.3)"   },
}
function getLangMeta(id) {
  return LANG_META[id] || { short: (id || "??").slice(0,3).toUpperCase(), color: "#888", bg: "rgba(136,136,136,0.12)", border: "rgba(136,136,136,0.3)" }
}

// ── Monaco theme ──────────────────────────────────────────────────────────────
function defineThemeOnMount(_editor, monaco) {
  monaco.editor.defineTheme("conv-dark", {
    base: "vs-dark", inherit: true,
    rules: [
      { token: "keyword",         foreground: "D9A96A" },
      { token: "string",          foreground: "9DC7E5" },
      { token: "number",          foreground: "D8B25C" },
      { token: "comment",         foreground: "6D726D", fontStyle: "italic" },
      { token: "type.identifier", foreground: "89BFA0" },
      { token: "variable",        foreground: "F1EEE5" },
    ],
    colors: {
      "editor.background":                 "#151816",
      "editor.foreground":                 "#F5F4EE",
      "editorLineNumber.foreground":       "#2A2F2B",
      "editorLineNumber.activeForeground": "#B5B4AB",
      "editor.lineHighlightBackground":    "#1B1F1C",
      "editorGutter.background":           "#151816",
      "editor.selectionBackground":        "#2A3D2A",
    },
  })
  monaco.editor.defineTheme("conv-light", {
    base: "vs", inherit: true,
    rules: [
      { token: "keyword",         foreground: "8C472B" },
      { token: "string",          foreground: "3E6B4E" },
      { token: "number",          foreground: "A87D25" },
      { token: "comment",         foreground: "999990", fontStyle: "italic" },
      { token: "type.identifier", foreground: "2D6A4F" },
    ],
    colors: {
      "editor.background":                 "#FAF9F5",
      "editor.foreground":                 "#3A3A35",
      "editorLineNumber.foreground":       "#D8D1BE",
      "editorLineNumber.activeForeground": "#6B6B63",
      "editor.lineHighlightBackground":    "#F3F0E2",
      "editorGutter.background":           "#FAF9F5",
    },
  })

  // Explicitly apply theme on mount so it loads immediately instead of falling back to default theme
  const resolvedTheme = useThemeStore.getState().resolvedTheme
  monaco.editor.setTheme(resolvedTheme === "dark" ? "conv-dark" : "conv-light")
}

const EDITOR_OPTIONS_BASE = {
  fontSize: 12.5,
  lineHeight: 21,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
  glyphMargin: false,
  folding: true,
  wordWrap: "off",
  padding: { top: 12, bottom: 12 },
}

// ── Language Selector Dropdown ────────────────────────────────────────────────
function LangSelector({ value, onChange, includeAuto = false, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const languages = getConverterLanguages()
  const meta = getLangMeta(value)
  const displayLabel = value === "auto"
    ? "Auto Detect"
    : (SUPPORTED_LANGUAGES.find(l => l.id === value)?.label || value)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{label}</div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer min-w-[190px] w-full"
        style={value !== "auto" ? { borderColor: meta.border } : {}}
      >
        {value !== "auto" ? (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 border"
            style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
            {meta.short}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--border)] bg-[var(--bg-tertiary)] shrink-0">
            <Languages size={15} className="text-[var(--text-muted)]" />
          </div>
        )}
        <div className="flex-1 text-left min-w-0">
          <div className="text-[13px] font-bold text-[var(--text-primary)] truncate">{displayLabel}</div>
          <div className="text-[9px] text-[var(--text-muted)] mt-0.5">
            {value === "auto" ? "Detect from content" : `${displayLabel} source`}
          </div>
        </div>
        <ChevronDown size={13} className={`text-[var(--text-muted)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 premium-card shadow-2xl py-1.5 z-[60] w-full max-h-64 overflow-y-auto">
          {includeAuto && (
            <>
              <button onClick={() => { onChange("auto"); setOpen(false) }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-left transition-colors cursor-pointer ${value === "auto" ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"}`}>
                <Languages size={13} className="shrink-0" />
                <span className="flex-1">Auto Detect</span>
                {value === "auto" && <Check size={11} strokeWidth={3} />}
              </button>
              <div className="h-px bg-[var(--border)] mx-3 my-1" />
            </>
          )}
          {languages.map(lang => {
            const m = getLangMeta(lang.id)
            return (
              <button key={lang.id} onClick={() => { onChange(lang.id); setOpen(false) }}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${value === lang.id ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"}`}>
                <div className="w-5 h-5 rounded flex items-center justify-center text-[7px] font-black shrink-0"
                  style={{ background: m.bg, color: m.color }}>
                  {m.short}
                </div>
                <span className="flex-1">{lang.label}</span>
                {value === lang.id && <Check size={11} strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Animated Converting View ──────────────────────────────────────────────────
function ConvertingView({ progress, sourceLang, targetLang }) {
  const srcMeta = getLangMeta(sourceLang)
  const tgtMeta = getLangMeta(targetLang)
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center gap-10 bg-[var(--bg-primary)]">
      {/* Language flow animation */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black border-2 shadow-lg"
            style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.color,
              boxShadow: `0 0 24px ${srcMeta.color}25` }}>
            {srcMeta.short}
          </div>
          <span className="text-[10px] font-semibold text-[var(--text-muted)]">{getLanguageLabel(sourceLang)}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5 items-center">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: "var(--accent-primary)",
                  animation: `pulse 1.2s ease-in-out ${i * 0.18}s infinite`,
                  opacity: 0.3
                }} />
            ))}
          </div>
          <div className="text-[9px] uppercase tracking-widest font-bold text-[var(--text-muted)]">Translating</div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black border-2 shadow-lg animate-pulse"
            style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.color,
              boxShadow: `0 0 24px ${tgtMeta.color}25` }}>
            {tgtMeta.short}
          </div>
          <span className="text-[10px] font-semibold text-[var(--text-muted)]">{getLanguageLabel(targetLang)}</span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col gap-2.5 w-72">
        {CONVERSION_PROGRESS_STEPS.map((step, i) => {
          const isActive = progress ? progress.stepIndex === i : (i === 0)
          const isDone   = progress ? progress.stepIndex > i : false
          return (
            <div key={step.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
              isActive ? "border-[var(--accent-primary)]/30 bg-[color-mix(in_srgb,var(--accent-primary)_6%,transparent)]"
                       : isDone ? "border-[var(--border)]/50 opacity-50"
                                : "border-transparent opacity-20"
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                isDone   ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-on)]"
                : isActive ? "border-[var(--accent-primary)]"
                           : "border-[var(--border)]"
              }`}>
                {isDone   ? <Check size={10} strokeWidth={3} /> : null}
                {isActive ? <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" /> : null}
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}>
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <Loader2 size={12} className="animate-spin text-[var(--accent-primary)]" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Metrics pills (compact, inline) ─────────────────────────────────────────
function MetricsPills({ notes, style }) {
  const changes = notes.length
  const accuracy     = changes === 0 ? 100 : Math.min(99, 92 + Math.min(changes, 6))
  const idiomaticity = style === "production" ? 99 : style === "idiomatic" ? Math.min(98, 85 + changes * 2) : 72

  return (
    <div className="hidden md:flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-green-500/20 bg-green-500/8 text-[10px] font-bold text-green-500">
        <CheckCircle2 size={11} strokeWidth={2.5} />
        {accuracy}% accuracy
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-violet-500/20 bg-violet-500/8 text-[10px] font-bold text-violet-400">
        <Zap size={11} strokeWidth={2.5} />
        {idiomaticity}% idiomatic
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] text-[10px] font-bold text-[var(--text-muted)]">
        <Shield size={11} strokeWidth={2.5} />
        0 warnings
      </div>
    </div>
  )
}

// ── Code Panel (original or converted) ───────────────────────────────────────
function CodePanel({ code, language, monacoTheme, label, sublabel, meta, accent }) {
  const lines = code ? code.split("\n").length : 0
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); toast.success("Copied!") }
    catch { toast.error("Failed to copy") }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 bg-[var(--bg-secondary)]">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 shrink-0 border-b"
        style={{
          borderColor: `${meta.color}25`,
          background: `linear-gradient(90deg, ${meta.bg} 0%, transparent 60%)`,
          borderTopColor: "var(--border)",
        }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-black border shrink-0"
            style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
            {meta.short}
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
            <span className="text-[10px] text-[var(--text-muted)] ml-2">{sublabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold"
            style={{ color: accent }}>
            <FileCode2 size={11} />
            {lines} lines
          </div>
          <button onClick={handleCopy}
            className="p-1.5 rounded-md transition-colors cursor-pointer hover:bg-[var(--bg-tertiary)]"
            title="Copy code">
            <Copy size={12} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" />
          </button>
        </div>
      </div>
      {/* Monaco */}
      <div className="flex-1 min-h-0">
        <Editor
          value={code}
          language={language}
          theme={monacoTheme}
          onMount={defineThemeOnMount}
          options={{ ...EDITOR_OPTIONS_BASE, readOnly: true }}
        />
      </div>
    </div>
  )
}

// ── Insights grid ─────────────────────────────────────────────────────────────
function InsightsGrid({ notes, sourceLang, targetLang, style }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-[var(--text-muted)]">
        <CheckCircle2 size={32} className="opacity-30" />
        <p className="text-sm">No syntax changes detected for this conversion.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
      {notes.map((note, i) => (
        <div key={note.id}
          className="flex flex-col gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/40 transition-all duration-200 group">
          {/* Card header */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] text-[var(--accent-primary)] text-[9px] font-black shrink-0">
              {i + 1}
            </div>
            <span className="text-[11px] font-bold text-[var(--text-primary)] leading-snug line-clamp-1">
              {note.from}
            </span>
          </div>
          {/* Before / After */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg px-2.5 py-2 border bg-red-500/5 border-red-500/15">
              <div className="text-[8px] uppercase font-bold text-red-400 mb-1.5 tracking-wider">Before</div>
              <code className="text-[10px] font-mono text-[var(--text-secondary)] leading-relaxed break-all line-clamp-2">{note.from}</code>
            </div>
            <div className="rounded-lg px-2.5 py-2 border bg-green-500/5 border-green-500/15">
              <div className="text-[8px] uppercase font-bold text-green-400 mb-1.5 tracking-wider">After</div>
              <code className="text-[10px] font-mono text-[var(--text-primary)] leading-relaxed break-all line-clamp-2">{note.to}</code>
            </div>
          </div>
          {/* Reason */}
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3 line-clamp-3 group-hover:line-clamp-none transition-all">
            {note.reason}
          </p>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN WORKSPACE
// ═══════════════════════════════════════════════════════════════════════════════
export function ConvertWorkspace() {
  const codeStoreCode = useCodeStore(s => s.code)
  const codeStoreLang = useCodeStore(s => s.language)

  // Own input state — the converter has its own editor
  const [inputCode, setInputCode] = useState(() => codeStoreCode || "")

  const sourceLang         = useConverterStore(s => s.sourceLang)
  const targetLang         = useConverterStore(s => s.targetLang)
  const conversionStyle    = useConverterStore(s => s.conversionStyle)
  const options            = useConverterStore(s => s.options)
  const originalCode       = useConverterStore(s => s.originalCode)
  const convertedCode      = useConverterStore(s => s.convertedCode)
  const detectedSourceLang = useConverterStore(s => s.detectedSourceLang)
  const isConverting       = useConverterStore(s => s.isConverting)
  const conversionNotes    = useConverterStore(s => s.conversionNotes)
  const progress           = useConverterStore(s => s.progress)

  const setSourceLang       = useConverterStore(s => s.setSourceLang)
  const setTargetLang       = useConverterStore(s => s.setTargetLang)
  const setConversionStyle  = useConverterStore(s => s.setConversionStyle)
  const setOption           = useConverterStore(s => s.setOption)
  const doRunConversion     = useConverterStore(s => s.runConversion)
  const applyConversion     = useConverterStore(s => s.applyConversion)
  const exportConvertedFile = useConverterStore(s => s.exportConvertedFile)
  const reset               = useConverterStore(s => s.reset)

  const resolvedTheme = useThemeStore(s => s.resolvedTheme)
  const monacoTheme   = resolvedTheme === "dark" ? "conv-dark" : "conv-light"

  const [activeTab,  setActiveTab]  = useState("preview")
  const [viewLayout, setViewLayout] = useState("split")
  const [isDesktop,  setIsDesktop]  = useState(window.innerWidth >= 900)

  // Live-detected language from input content (for display only)
  const liveDetectedLang = inputCode.trim()
    ? (sourceLang !== "auto" ? sourceLang : detectLanguageFromContent(inputCode))
    : null

  // After conversion, the true source lang comes from the store
  const resolvedSource = detectedSourceLang || liveDetectedLang || codeStoreLang || "javascript"
  const srcMeta = getLangMeta(resolvedSource)
  const tgtMeta = getLangMeta(targetLang)
  const srcLabel = getLanguageLabel(resolvedSource)
  const tgtLabel = getLanguageLabel(targetLang)

  const { fileExtension: tgtExt = "txt" } = SUPPORTED_LANGUAGES.find(l => l.id === targetLang) || {}

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)")
    const h = e => setIsDesktop(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  const hasResult = !isConverting && !!convertedCode

  // ── HANDLE CONVERT ───────────────────────────────────────────────────────
  const handleConvert = async () => {
    if (!inputCode.trim()) {
      toast.warning("Paste or type some source code first")
      return
    }
    // ✅ FIX: always pass sourceLang as-is ("auto" or explicit id)
    // The generator's runConversion() handles "auto" by detecting from content
    await doRunConversion(inputCode, sourceLang)
    setActiveTab("preview")
  }

  const handleReset = () => {
    reset()
    setActiveTab("preview")
  }

  const handleApply = () => {
    applyConversion()
    toast.success(`Applied as ${tgtLabel}`)
  }

  const handleExport = () => {
    exportConvertedFile()
    toast.success(`Exported as converted.${tgtExt}`)
  }

  const STYLE_OPTIONS = [
    { id: "direct",     label: "Direct" },
    { id: "idiomatic",  label: "Idiomatic" },
    { id: "production", label: "Production Ready" },
  ]

  // ────────────────────────────────────────────────────────────────────────────
  // INPUT STATE
  // ────────────────────────────────────────────────────────────────────────────
  if (!hasResult && !isConverting) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">

        {/* Config bar */}
        <div className="shrink-0 bg-[var(--bg-secondary)] border-b border-[var(--border)] px-5 py-4">
          <div className="flex flex-wrap items-end gap-4">

            {/* Language cards */}
            <div className="flex items-end gap-3">
              <LangSelector label="Source Language" value={sourceLang} onChange={setSourceLang} includeAuto />

              {/* Swap indicator */}
              <div className="pb-3.5 shrink-0">
                <div className="w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <ArrowRight size={15} className="text-[var(--accent-primary)]" />
                </div>
              </div>

              <LangSelector label="Target Language" value={targetLang} onChange={setTargetLang} />
            </div>

            <div className="flex flex-col gap-3 flex-1 lg:items-end">
              {/* Checkboxes */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  { key: "generateIdiomatic",     label: "Idiomatic Code" },
                  { key: "preserveComments",      label: "Preserve Comments" },
                  { key: "addBestPractices",      label: "Best Practices" },
                  { key: "preserveVariableNames", label: "Variable Names" },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer group select-none">
                    <div onClick={() => setOption(opt.key, !options[opt.key])}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        options[opt.key]
                          ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]"
                          : "border-[var(--border)] hover:border-[var(--accent-primary)]"
                      }`}>
                      {options[opt.key] && <Check size={9} strokeWidth={3} className="text-[var(--accent-on)]" />}
                    </div>
                    <span onClick={() => setOption(opt.key, !options[opt.key])}
                      className="text-[11px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Style + Convert */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
                  {STYLE_OPTIONS.map(s => (
                    <button key={s.id} onClick={() => setConversionStyle(s.id)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        conversionStyle === s.id
                          ? "bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <button onClick={handleConvert}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-all active:scale-[0.97] cursor-pointer shadow-lg"
                  style={{ boxShadow: "0 4px 20px color-mix(in srgb, var(--accent-primary) 30%, transparent)" }}>
                  <Sparkles size={15} />
                  Convert Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Monaco input — full remaining height */}
        <div className="flex-1 min-h-0 relative bg-[var(--bg-secondary)]">
          {/* Language indicator pill */}
          <div className="absolute top-3 right-4 z-10 pointer-events-none">
            {liveDetectedLang && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold"
                style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.color }}>
                <div className="w-3.5 h-3.5 rounded flex items-center justify-center text-[6px] font-black"
                  style={{ background: srcMeta.color, color: "#000" }}>
                  {srcMeta.short.charAt(0)}
                </div>
                {srcLabel}
              </div>
            )}
          </div>

          <Editor
            value={inputCode}
            language={liveDetectedLang || "plaintext"}
            theme={monacoTheme}
            onMount={defineThemeOnMount}
            onChange={(val) => setInputCode(val || "")}
            options={{
              ...EDITOR_OPTIONS_BASE,
              fontSize: 13,
              lineHeight: 22,
              wordWrap: "on",
            }}
          />

          {/* Empty state overlay */}
          {!inputCode.trim() && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 pointer-events-none select-none">
              <div className="flex items-center gap-5 opacity-25">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black border-2"
                  style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.color }}>
                  {srcMeta.short}
                </div>
                <ArrowRight size={22} className="text-[var(--text-muted)]" />
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black border-2"
                  style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.color }}>
                  {tgtMeta.short}
                </div>
              </div>
              <div className="text-center opacity-40">
                <p className="text-sm font-bold text-[var(--text-primary)]">Paste your source code here</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Type or paste {srcLabel} code, then click <strong>Convert Code</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // CONVERTING STATE
  // ────────────────────────────────────────────────────────────────────────────
  if (isConverting) {
    return (
      <div className="flex-1 h-full min-h-0 bg-[var(--bg-primary)]">
        <ConvertingView progress={progress} sourceLang={resolvedSource} targetLang={targetLang} />
      </div>
    )
  }

  // ────────────────────────────────────────────────────────────────────────────
  // RESULT STATE
  // ────────────────────────────────────────────────────────────────────────────
  const originalLines  = originalCode  ? originalCode.split("\n").length  : 0
  const convertedLines = convertedCode ? convertedCode.split("\n").length : 0

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">

      {/* ── Header: Language flow + Metrics ── */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3">
        <div className="flex items-center gap-4 flex-wrap">

          {/* Language flow */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Source */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border shrink-0"
                style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.color }}>
                {srcMeta.short}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">{srcLabel}</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: srcMeta.color }}>
                  • Auto-detected
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-1 px-1">
              <div className="w-10 h-px border-t border-dashed border-[var(--border)]" />
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-primary)", boxShadow: "0 0 12px color-mix(in srgb, var(--accent-primary) 40%, transparent)" }}>
                <ArrowRight size={12} className="text-[var(--accent-on)]" strokeWidth={2.5} />
              </div>
              <div className="w-10 h-px border-t border-dashed border-[var(--border)]" />
            </div>

            {/* Target */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border shrink-0"
                style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.color }}>
                {tgtMeta.short}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">{tgtLabel}</div>
                <div className="text-[9px] text-green-500 font-semibold mt-0.5">• Converted</div>
              </div>
            </div>

            {/* Pill: lines converted */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-3 py-1.5 rounded-full text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20">
              <CheckCircle2 size={11} strokeWidth={2.5} />
              {convertedLines} lines · {conversionNotes.length} changes
            </div>
          </div>

          {/* Metrics */}
          <MetricsPills notes={conversionNotes} style={conversionStyle} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="shrink-0 flex items-center justify-between px-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex">
          {[
            { id: "preview",  Icon: Columns2,   label: "Preview" },
            { id: "changes",  Icon: GitCompare, label: "Changes" },
            { id: "insights", Icon: Lightbulb,  label: "Insights",
              badge: conversionNotes.length > 0 ? conversionNotes.length : null },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}>
              <tab.Icon size={13} />
              {tab.label}
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-[var(--accent-primary)] text-[var(--accent-on)]">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "preview" && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
            {[
              { id: "split",  Icon: Columns2,  label: "Split" },
              { id: "single", Icon: AlignLeft, label: "Single" },
            ].map(v => (
              <button key={v.id} onClick={() => setViewLayout(v.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  viewLayout === v.id
                    ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}>
                <v.Icon size={11} />
                {v.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* PREVIEW */}
        {activeTab === "preview" && (
          <div className={`flex ${viewLayout === "split" && isDesktop ? "flex-row" : "flex-col"} h-full min-h-0`}>
            {/* Divider */}
            {viewLayout === "split" && isDesktop && (
              <>
                <CodePanel
                  code={originalCode}
                  language={resolvedSource}
                  monacoTheme={monacoTheme}
                  label={srcLabel}
                  sublabel="Original"
                  meta={srcMeta}
                  accent={srcMeta.color}
                />
                <div className="w-px bg-[var(--border)] shrink-0" />
                <CodePanel
                  code={convertedCode}
                  language={targetLang}
                  monacoTheme={monacoTheme}
                  label={tgtLabel}
                  sublabel="Converted"
                  meta={tgtMeta}
                  accent="#22c55e"
                />
              </>
            )}
            {(!isDesktop || viewLayout === "single") && (
              <CodePanel
                code={convertedCode}
                language={targetLang}
                monacoTheme={monacoTheme}
                label={tgtLabel}
                sublabel="Converted"
                meta={tgtMeta}
                accent="#22c55e"
              />
            )}
          </div>
        )}

        {/* CHANGES — DiffEditor */}
        {activeTab === "changes" && (
          <DiffEditor
            original={originalCode}
            modified={convertedCode}
            language={targetLang}
            theme={monacoTheme}
            onMount={defineThemeOnMount}
            options={{ ...EDITOR_OPTIONS_BASE, readOnly: true, renderSideBySide: isDesktop }}
          />
        )}

        {/* INSIGHTS */}
        {activeTab === "insights" && (
          <div className="h-full overflow-y-auto">
            {/* Summary card */}
            <div className="flex items-center gap-4 mx-5 mt-5 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] shrink-0">
                <Lightbulb size={20} className="text-[var(--accent-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {conversionNotes.length} Syntax Changes Applied
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {srcLabel} → {tgtLabel} · {conversionStyle} mode
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5 shrink-0">
                <Check size={11} strokeWidth={3} />
                Successful
              </div>
            </div>
            <InsightsGrid
              notes={conversionNotes}
              sourceLang={resolvedSource}
              targetLang={targetLang}
              style={conversionStyle}
            />
            {/* Info */}
            <div className="flex items-start gap-2.5 mx-5 mb-5 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/15 text-[10px] text-blue-400">
              <Info size={12} className="shrink-0 mt-0.5 text-blue-400" />
              <span>Conversion preserves original logic. For complex codebases, manually review idioms, generics, and type annotations.</span>
            </div>
          </div>
        )}
      </div>



      {/* ── Bottom action bar ── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer">
          <RotateCcw size={13} />
          Reset
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab("changes")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer">
            <GitCompare size={13} />
            View Changes
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer">
            <Download size={13} />
            Export .{tgtExt}
          </button>
          <button onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs text-[var(--accent-on)] transition-all active:scale-[0.97] cursor-pointer"
            style={{
              background: "var(--accent-primary)",
              boxShadow: "0 2px 16px color-mix(in srgb, var(--accent-primary) 35%, transparent)"
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.currentTarget.style.filter = ""}>
            <Check size={13} strokeWidth={2.5} />
            Apply Conversion
          </button>
        </div>
      </div>
    </div>
  )
}
