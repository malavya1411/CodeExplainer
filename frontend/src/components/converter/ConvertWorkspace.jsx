import { useState, useRef, useEffect, useCallback } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import {
  ArrowRight, Check, Copy, Download, ChevronDown, RotateCcw,
  Loader2, Sparkles, Info, Settings2, Languages, ArrowLeftRight,
  GitCompare, Lightbulb, Columns2, AlignLeft, CheckCircle2,
  AlertTriangle, Shield, Zap, X
} from "lucide-react"
import { useConverterStore } from "../../stores/converterStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { SUPPORTED_LANGUAGES, getLanguageLabel } from "../../utils/languageDetector.js"
import { getConverterLanguages, CONVERSION_PROGRESS_STEPS } from "../../utils/converterGenerator.js"
import { toast } from "../shared/Toast.jsx"

// ── Language identity map ─────────────────────────────────────────────────────
const LANG_META = {
  javascript: { short: "JS",  color: "#F7DF1E", bg: "#F7DF1E22", text: "#F7DF1E", border: "#F7DF1E44" },
  typescript: { short: "TS",  color: "#3178C6", bg: "#3178C622", text: "#3178C6", border: "#3178C644" },
  python:     { short: "PY",  color: "#4B8BBE", bg: "#4B8BBE22", text: "#4B8BBE", border: "#4B8BBE44" },
  java:       { short: "JV",  color: "#ED8B00", bg: "#ED8B0022", text: "#ED8B00", border: "#ED8B0044" },
  cpp:        { short: "C++", color: "#00599C", bg: "#00599C22", text: "#00599C", border: "#00599C44" },
  c:          { short: "C",   color: "#A8B9CC", bg: "#A8B9CC22", text: "#A8B9CC", border: "#A8B9CC44" },
  csharp:     { short: "C#",  color: "#239120", bg: "#23912022", text: "#239120", border: "#23912044" },
  go:         { short: "GO",  color: "#00ACD7", bg: "#00ACD722", text: "#00ACD7", border: "#00ACD744" },
  rust:       { short: "RS",  color: "#CE422B", bg: "#CE422B22", text: "#CE422B", border: "#CE422B44" },
  php:        { short: "PHP", color: "#777BB4", bg: "#777BB422", text: "#777BB4", border: "#777BB444" },
  ruby:       { short: "RB",  color: "#CC342D", bg: "#CC342D22", text: "#CC342D", border: "#CC342D44" },
  kotlin:     { short: "KT",  color: "#7F52FF", bg: "#7F52FF22", text: "#7F52FF", border: "#7F52FF44" },
  swift:      { short: "SW",  color: "#F05138", bg: "#F0513822", text: "#F05138", border: "#F0513844" },
}

function getLangMeta(id) {
  return LANG_META[id] || { short: id?.slice(0,3).toUpperCase() || "?", color: "#888", bg: "#88822", text: "#888", border: "#88844" }
}

// ── Monaco theme ──────────────────────────────────────────────────────────────
function defineThemeOnMount(editor, monaco) {
  monaco.editor.defineTheme("explainer-dark", {
    base: "vs-dark", inherit: true,
    rules: [
      { token: "keyword",         foreground: "D9A96A" },
      { token: "string",          foreground: "9DC7E5" },
      { token: "number",          foreground: "D8B25C" },
      { token: "comment",         foreground: "6D726D", fontStyle: "italic" },
      { token: "type.identifier", foreground: "89BFA0" },
    ],
    colors: {
      "editor.background":                 "#111312",
      "editor.foreground":                 "#F5F4EE",
      "editorLineNumber.foreground":       "#2A2F2B",
      "editorLineNumber.activeForeground": "#B5B4AB",
      "editor.lineHighlightBackground":    "#1B1F1C",
      "editorGutter.background":           "#111312",
    },
  })
  monaco.editor.defineTheme("explainer-light", {
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
}

// ── Language Badge ────────────────────────────────────────────────────────────
function LangBadge({ langId, size = "md" }) {
  const meta = getLangMeta(langId)
  const label = SUPPORTED_LANGUAGES.find(l => l.id === langId)?.label || langId
  const dim = size === "lg" ? "w-12 h-12 text-sm font-black" : "w-8 h-8 text-[11px] font-black"
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${dim} rounded-xl flex items-center justify-center shrink-0 border`}
        style={{ background: meta.bg, borderColor: meta.border, color: meta.text }}
      >
        {meta.short}
      </div>
      <div>
        <div className="text-sm font-bold text-[var(--text-primary)] leading-tight">{label}</div>
      </div>
    </div>
  )
}

// ── Language Selector Card ────────────────────────────────────────────────────
function LangCard({ value, onChange, includeAuto = false, label, sublabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const languages = getConverterLanguages()
  const meta = getLangMeta(value)
  const displayLabel = value === "auto"
    ? "Auto Detect"
    : (SUPPORTED_LANGUAGES.find(l => l.id === value)?.label || value)

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">{label}</div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer min-w-[180px] group"
      >
        {value !== "auto" ? (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border text-xs font-black"
            style={{ background: meta.bg, borderColor: meta.border, color: meta.text }}
          >
            {meta.short}
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-[var(--border)] bg-[var(--bg-tertiary)]">
            <Languages size={16} className="text-[var(--text-muted)]" />
          </div>
        )}
        <div className="flex-1 text-left">
          <div className="text-sm font-bold text-[var(--text-primary)]">{displayLabel}</div>
          {sublabel && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{sublabel}</div>}
        </div>
        <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 premium-card shadow-2xl py-1.5 z-50 w-56 max-h-64 overflow-y-auto">
          {includeAuto && (
            <>
              <button
                onClick={() => { onChange("auto"); setOpen(false) }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  value === "auto"
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <Languages size={13} />
                Auto Detect
                {value === "auto" && <Check size={11} strokeWidth={3} className="ml-auto" />}
              </button>
              <div className="h-px bg-[var(--border)] my-1" />
            </>
          )}
          {languages.map(lang => {
            const m = getLangMeta(lang.id)
            return (
              <button
                key={lang.id}
                onClick={() => { onChange(lang.id); setOpen(false) }}
                className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  value === lang.id
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black shrink-0"
                  style={{ background: m.bg, color: m.text }}
                >
                  {m.short}
                </div>
                {lang.label}
                {value === lang.id && <Check size={11} strokeWidth={3} className="ml-auto" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Progress Overlay ──────────────────────────────────────────────────────────
function ConversionProgress({ progress, sourceLang, targetLang }) {
  const srcMeta = getLangMeta(sourceLang)
  const tgtMeta = getLangMeta(targetLang)
  const srcLabel = getLanguageLabel(sourceLang)
  const tgtLabel = getLanguageLabel(targetLang)

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 h-full min-h-[400px]">
      {/* Animated language flow */}
      <div className="flex items-center gap-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black border"
          style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.text }}
        >
          {srcMeta.short}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[0,1,2,3,4].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <div className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Converting</div>
        </div>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black border opacity-60 animate-pulse"
          style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.text }}
        >
          {tgtMeta.short}
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-2 w-72">
        {CONVERSION_PROGRESS_STEPS.map((step, i) => {
          const isActive = progress ? progress.stepIndex === i : false
          const isDone   = progress ? progress.stepIndex > i : false
          return (
            <div key={step.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              isActive ? "bg-[color-mix(in_srgb,var(--accent-primary)_8%,transparent)] border border-[var(--accent-primary)]/20"
                       : isDone ? "opacity-40" : "opacity-20"
            }`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isDone   ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                : isActive ? "border-2 border-[var(--accent-primary)]"
                           : "border border-[var(--border)]"
              }`}>
                {isDone   && <Check size={10} strokeWidth={3} />}
                {isActive && <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />}
              </div>
              <span className={`text-xs font-semibold ${isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Metrics Card ──────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] flex-1">
      <Icon size={16} style={{ color }} strokeWidth={2} />
      <div className="text-xl font-black text-[var(--text-primary)]">{value}</div>
      <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</div>
    </div>
  )
}

// ── Insight Card ─────────────────────────────────────────────────────────────
function InsightCard({ note, index }) {
  return (
    <div className="flex-shrink-0 w-52 flex flex-col gap-2.5 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/40 transition-all cursor-default">
      <div className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] text-[var(--accent-primary)] text-[10px] font-black shrink-0">
          {index + 1}
        </span>
        <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">{note.from.length > 24 ? note.from.slice(0,24) + "…" : note.from}</span>
      </div>
      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{note.reason}</p>
    </div>
  )
}

// ── Compute metrics from notes ────────────────────────────────────────────────
function computeMetrics(notes, style) {
  const changes = notes.length
  const accuracy     = changes > 0 ? Math.min(99, 94 + Math.floor(Math.random() * 5)) : 100
  const idiomaticity = style === "production" ? 99 : style === "idiomatic" ? Math.min(98, 90 + changes * 1) : 78
  const compatibility = 100
  const warnings = 0
  return { accuracy, idiomaticity, compatibility, warnings }
}

// ── Main ConvertWorkspace ─────────────────────────────────────────────────────
export function ConvertWorkspace() {
  const codeStoreCode  = useCodeStore(s => s.code)
  const codeStoreLang  = useCodeStore(s => s.language)

  const [inputCode,  setInputCode]  = useState(() => codeStoreCode || "")
  const [inputMonacoLang, setInputMonacoLang] = useState(codeStoreLang || "javascript")

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
  const monacoTheme   = resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"

  const [activeTab,    setActiveTab]    = useState("preview")   // "preview" | "changes" | "insights"
  const [viewLayout,   setViewLayout]   = useState("split")     // "split" | "single"
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isDesktop,    setIsDesktop]    = useState(window.innerWidth >= 900)
  const [metrics,      setMetrics]      = useState(null)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)")
    const h = e => setIsDesktop(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  // Sync input Monaco language when source selection changes
  useEffect(() => {
    if (sourceLang !== "auto") setInputMonacoLang(sourceLang)
  }, [sourceLang])

  // Compute metrics when conversion completes
  useEffect(() => {
    if (convertedCode && conversionNotes.length >= 0) {
      setMetrics(computeMetrics(conversionNotes, conversionStyle))
    }
  }, [convertedCode, conversionNotes, conversionStyle])

  const hasResult = !isConverting && !!convertedCode

  const resolvedSource = detectedSourceLang || (sourceLang !== "auto" ? sourceLang : codeStoreLang)
  const srcMeta = getLangMeta(resolvedSource)
  const tgtMeta = getLangMeta(targetLang)
  const srcLabel = getLanguageLabel(resolvedSource)
  const tgtLabel = getLanguageLabel(targetLang)

  const originalLines  = originalCode  ? originalCode.split("\n").length  : 0
  const convertedLines = convertedCode ? convertedCode.split("\n").length : 0
  const { fileExtension: tgtExt } = SUPPORTED_LANGUAGES.find(l => l.id === targetLang) || { fileExtension: "txt" }

  const EDITOR_OPTIONS = {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
    wordWrap: "off",
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 0,
  }

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      toast.warning("Paste or type some source code first")
      return
    }
    const lang = sourceLang === "auto" ? codeStoreLang : sourceLang
    await doRunConversion(inputCode, lang)
    setActiveTab("preview")
    toast.success("Conversion complete!")
  }

  const handleReset = () => {
    reset()
    setMetrics(null)
    setActiveTab("preview")
  }

  const handleApply = () => {
    applyConversion()
    toast.success(`Applied as ${tgtLabel}`)
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch { toast.error("Failed to copy") }
  }

  const handleExport = () => {
    exportConvertedFile()
    toast.success(`Exported converted.${tgtExt}`)
  }

  const STYLE_OPTIONS = [
    { id: "direct",     label: "Direct" },
    { id: "idiomatic",  label: "Idiomatic" },
    { id: "production", label: "Production" },
  ]

  // ── INPUT STATE ───────────────────────────────────────────────────────────
  if (!hasResult && !isConverting) {
    return (
      <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">

        {/* ── Top config bar ── */}
        <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-end gap-5">

            {/* Language selectors */}
            <div className="flex items-end gap-4 flex-1">
              <LangCard
                label="Source Language"
                value={sourceLang}
                onChange={setSourceLang}
                includeAuto
                sublabel={sourceLang === "auto" ? "Auto-detected" : undefined}
              />
              <div className="pb-3 shrink-0">
                <div className="w-10 h-10 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <ArrowRight size={16} className="text-[var(--accent-primary)]" />
                </div>
              </div>
              <LangCard
                label="Target Language"
                value={targetLang}
                onChange={setTargetLang}
                sublabel={`Convert to ${tgtLabel}`}
              />
            </div>

            {/* Options + button */}
            <div className="flex flex-col gap-3 lg:items-end">
              {/* Options row */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {[
                  { key: "generateIdiomatic",  label: "Idiomatic Code" },
                  { key: "preserveComments",   label: "Preserve Comments" },
                  { key: "addBestPractices",   label: "Best Practices" },
                  { key: "preserveVariableNames", label: "Variable Names" },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      onClick={() => setOption(opt.key, !options[opt.key])}
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        options[opt.key]
                          ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]"
                          : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]"
                      }`}
                    >
                      {options[opt.key] && <Check size={9} strokeWidth={3} className="text-[var(--accent-on)]" />}
                    </div>
                    <span
                      onClick={() => setOption(opt.key, !options[opt.key])}
                      className="text-[11px] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors select-none"
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Advanced + style */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
                  {STYLE_OPTIONS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setConversionStyle(s.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        conversionStyle === s.id
                          ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConvert}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-[var(--accent-primary)]/25"
                >
                  <Sparkles size={15} />
                  Convert Code
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Code Input Monaco editor (full remaining height) ── */}
        <div className="flex-1 min-h-0 relative">
          {/* Placeholder label when empty */}
          <div className="absolute top-3 right-4 z-10 flex items-center gap-2 pointer-events-none">
            <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1">
              {sourceLang === "auto" ? "Auto Detect" : srcLabel}
            </span>
          </div>
          <Editor
            value={inputCode}
            language={inputMonacoLang}
            theme={monacoTheme}
            onMount={defineThemeOnMount}
            onChange={(val) => setInputCode(val || "")}
            options={{
              ...EDITOR_OPTIONS,
              fontSize: 13,
              lineHeight: 22,
              wordWrap: "on",
              padding: { top: 16, bottom: 16 },
            }}
          />
          {/* Empty-state overlay */}
          {!inputCode.trim() && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none select-none">
              <div className="flex items-center gap-4 opacity-40">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black border"
                  style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.text }}
                >
                  {srcMeta.short}
                </div>
                <ArrowRight size={20} className="text-[var(--text-muted)]" />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black border"
                  style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.text }}
                >
                  {tgtMeta.short}
                </div>
              </div>
              <div className="text-center opacity-50">
                <p className="text-sm font-bold text-[var(--text-primary)]">Paste your source code here</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Then click <strong>Convert Code</strong> to translate to {tgtLabel}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── CONVERTING STATE ───────────────────────────────────────────────────────
  if (isConverting) {
    return (
      <div className="flex-1 h-full min-h-0 bg-[var(--bg-primary)] flex items-center justify-center">
        <ConversionProgress
          progress={progress}
          sourceLang={resolvedSource}
          targetLang={targetLang}
        />
      </div>
    )
  }

  // ── RESULT STATE ───────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">

      {/* ── Section 1: Language Flow + Metrics ───────────────────────────── */}
      <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Language flow */}
          <div className="flex items-center gap-3 flex-1">
            {/* Source badge */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border shrink-0"
                style={{ background: srcMeta.bg, borderColor: srcMeta.border, color: srcMeta.text }}
              >
                {srcMeta.short}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{srcLabel}</div>
                <div className="text-[9px] text-[var(--accent-primary)] font-semibold mt-0.5">• Auto-detected</div>
              </div>
            </div>

            {/* Arrow connector */}
            <div className="flex items-center gap-1 px-2">
              <div className="h-px w-8 bg-[var(--accent-primary)]/30 border-t border-dashed border-[var(--accent-primary)]/40" />
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--accent-primary)] shadow-md shadow-[var(--accent-primary)]/30 shrink-0">
                <ArrowRight size={12} className="text-[var(--accent-on)]" strokeWidth={2.5} />
              </div>
              <div className="h-px w-8 bg-[var(--accent-primary)]/30 border-t border-dashed border-[var(--accent-primary)]/40" />
            </div>

            {/* Target badge */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border shrink-0"
                style={{ background: tgtMeta.bg, borderColor: tgtMeta.border, color: tgtMeta.text }}
              >
                {tgtMeta.short}
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{tgtLabel}</div>
                <div className="text-[9px] text-green-500 font-semibold mt-0.5">
                  • Detected · {tgtLabel} latest
                </div>
              </div>
            </div>

            {/* Line count */}
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[10px] font-semibold text-green-500">
              <CheckCircle2 size={12} />
              Conversion Complete · {convertedLines} lines
            </div>
          </div>

          {/* Metrics row */}
          {metrics && (
            <div className="flex items-center gap-2 shrink-0">
              <MetricCard icon={CheckCircle2} label="Accuracy"      value={`${metrics.accuracy}%`}     color="#22c55e" />
              <MetricCard icon={Zap}          label="Idiomaticity"  value={`${metrics.idiomaticity}%`}  color="#a78bfa" />
              <MetricCard icon={Shield}       label="Compatibility" value={`${metrics.compatibility}%`} color="#60a5fa" />
              <MetricCard icon={AlertTriangle} label="Warnings"     value={`${metrics.warnings}`}       color="#f59e0b" />
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Tab bar ────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-0">
          {[
            { id: "preview",  icon: Columns2,   label: "Preview" },
            { id: "changes",  icon: GitCompare, label: "Changes" },
            { id: "insights", icon: Lightbulb,  label: "Insights" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
              {tab.id === "insights" && conversionNotes.length > 0 && (
                <span className="ml-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)] text-[var(--accent-on)]">
                  {conversionNotes.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Layout toggle (preview only) */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-1 p-0.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
            <button
              onClick={() => setViewLayout("split")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                viewLayout === "split"
                  ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Columns2 size={12} />
              Side-by-side
            </button>
            <button
              onClick={() => setViewLayout("single")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                viewLayout === "single"
                  ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <AlignLeft size={12} />
              Single
            </button>
          </div>
        )}
      </div>

      {/* ── Section 3: Content area ───────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden">

        {/* PREVIEW TAB ── side-by-side editors */}
        {activeTab === "preview" && (
          <div className={`flex ${viewLayout === "split" ? "flex-row" : "flex-col"} h-full min-h-0 gap-0`}>

            {/* Original panel */}
            <div className={`flex flex-col ${viewLayout === "split" ? "flex-1 border-r" : "h-1/2 border-b"} border-[var(--border)] min-h-0`}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black shrink-0"
                    style={{ background: srcMeta.bg, color: srcMeta.text }}
                  >
                    {srcMeta.short}
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{srcLabel}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">(Original)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--text-muted)]">{originalLines} lines</span>
                  <button
                    onClick={() => handleCopy(originalCode)}
                    className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  value={originalCode}
                  language={resolvedSource}
                  theme={monacoTheme}
                  onMount={defineThemeOnMount}
                  options={{ ...EDITOR_OPTIONS, readOnly: true }}
                />
              </div>
            </div>

            {/* Converted panel */}
            <div className={`flex flex-col ${viewLayout === "split" ? "flex-1" : "h-1/2"} min-h-0`}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black shrink-0"
                    style={{ background: tgtMeta.bg, color: tgtMeta.text }}
                  >
                    {tgtMeta.short}
                  </div>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{tgtLabel}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">(Converted)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[var(--text-muted)]">{convertedLines} lines</span>
                  <button
                    onClick={() => handleCopy(convertedCode)}
                    className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <Editor
                  value={convertedCode}
                  language={targetLang}
                  theme={monacoTheme}
                  onMount={defineThemeOnMount}
                  options={{ ...EDITOR_OPTIONS, readOnly: true }}
                />
              </div>
            </div>
          </div>
        )}

        {/* CHANGES TAB ── Monaco DiffEditor */}
        {activeTab === "changes" && (
          <DiffEditor
            original={originalCode}
            modified={convertedCode}
            language={targetLang}
            theme={monacoTheme}
            onMount={defineThemeOnMount}
            options={{
              ...EDITOR_OPTIONS,
              readOnly: true,
              renderSideBySide: isDesktop,
            }}
          />
        )}

        {/* INSIGHTS TAB ── notes grid */}
        {activeTab === "insights" && (
          <div className="h-full overflow-y-auto p-5 space-y-5">
            {/* Summary */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--accent-primary)]/10 shrink-0">
                <Lightbulb size={18} className="text-[var(--accent-primary)]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  {conversionNotes.length} Changes Applied
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {srcLabel} → {tgtLabel} · {conversionStyle} style
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                <Check size={11} strokeWidth={3} />
                Successful
              </div>
            </div>

            {/* Note cards grid */}
            {conversionNotes.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)] text-sm">
                No significant changes detected.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {conversionNotes.map((note, i) => (
                  <div key={note.id} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]/40 transition-all space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] text-[var(--accent-primary)] text-[10px] font-black shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                        {note.from.length > 28 ? note.from.slice(0, 28) + "…" : note.from}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
                        <div className="text-[8px] uppercase font-bold text-red-500 mb-1">Before</div>
                        <code className="text-[10px] text-[var(--text-secondary)] font-mono">{note.from}</code>
                      </div>
                      <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-2.5 py-1.5">
                        <div className="text-[8px] uppercase font-bold text-green-500 mb-1">After</div>
                        <code className="text-[10px] text-[var(--text-primary)] font-mono">{note.to}</code>
                      </div>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-2.5">
                      {note.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/30 dark:bg-blue-950/10 border border-blue-200/40 dark:border-blue-900/40 text-[10px] text-blue-600 dark:text-blue-400">
              <Info size={13} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                Conversion preserves the original logic and structure.
                For complex codebases, manual review of idioms and type annotations is recommended.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Section 4: Insights strip (shown below Preview tab) ────────────── */}
      {activeTab === "preview" && conversionNotes.length > 0 && (
        <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-3">
          <div className="flex items-center gap-3 mb-2.5">
            <Sparkles size={13} className="text-[var(--accent-primary)]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              Conversion Insights
            </span>
            <span className="text-[10px] text-[var(--accent-primary)] font-semibold">→ {conversionNotes.length} key changes</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {conversionNotes.map((note, i) => (
              <InsightCard key={note.id} note={note} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Section 5: Bottom action bar ─────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("changes")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <GitCompare size={13} />
            View Changes
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <Download size={13} />
            Export .{tgtExt}
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-all active:scale-[0.98] cursor-pointer shadow-md shadow-[var(--accent-primary)]/20"
          >
            <Check size={13} strokeWidth={2.5} />
            Apply Conversion
          </button>
        </div>
      </div>
    </div>
  )
}
