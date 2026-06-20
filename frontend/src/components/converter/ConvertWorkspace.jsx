import { useState, useRef, useEffect } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import {
  ArrowLeftRight, Check, Copy, Download, ChevronDown, ArrowRight,
  Loader2, Sparkles, Info, Settings2, Languages, RotateCcw, Clipboard
} from "lucide-react"
import { useConverterStore } from "../../stores/converterStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { SUPPORTED_LANGUAGES, getLanguageLabel } from "../../utils/languageDetector.js"
import { getConverterLanguages, CONVERSION_PROGRESS_STEPS } from "../../utils/converterGenerator.js"
import { toast } from "../shared/Toast.jsx"

// ── Monaco theme registrar ────────────────────────────────────────────────────
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
      "editor.background":                 "#151816",
      "editor.foreground":                 "#F5F4EE",
      "editorLineNumber.foreground":       "#2A2F2B",
      "editorLineNumber.activeForeground": "#B5B4AB",
      "editor.lineHighlightBackground":    "#1B1F1C",
      "editorGutter.background":           "#151816",
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

// ── Language Selector Dropdown ────────────────────────────────────────────────
function LangDropdown({ value, onChange, includeAuto = false, label }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const languages = getConverterLanguages()

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [])

  const displayLabel = value === "auto"
    ? "Auto Detect"
    : (SUPPORTED_LANGUAGES.find(l => l.id === value)?.label || value)

  return (
    <div className="relative flex-1" ref={ref}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">{label}</div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Languages size={13} className="text-[var(--accent-primary)]" />
          {displayLabel}
        </span>
        <ChevronDown size={13} className={`text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 premium-card shadow-xl py-1 z-50 max-h-56 overflow-y-auto">
          {includeAuto && (
            <>
              <button
                onClick={() => { onChange("auto"); setOpen(false) }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  value === "auto"
                    ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                Auto Detect
                {value === "auto" && <Check size={11} strokeWidth={3} />}
              </button>
              <div className="h-px bg-[var(--border)] my-1" />
            </>
          )}
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => { onChange(lang.id); setOpen(false) }}
              className={`flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                value === lang.id
                  ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] font-bold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {lang.label}
              {value === lang.id && <Check size={11} strokeWidth={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Progress Overlay ──────────────────────────────────────────────────────────
function ProgressOverlay({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--bg-tertiary)]" />
          <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-primary)] border-t-transparent animate-spin" />
          <Languages size={22} className="text-[var(--accent-primary)]" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-[var(--text-primary)]">Converting Code</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Processing large file…</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-60">
        {CONVERSION_PROGRESS_STEPS.map((step, i) => {
          const isActive = progress.stepIndex === i
          const isDone   = progress.stepIndex > i
          return (
            <div key={step.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              isActive ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] border border-[var(--accent-primary)]/30"
                       : isDone ? "opacity-50" : "opacity-25"
            }`}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                isDone   ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                : isActive ? "border-2 border-[var(--accent-primary)]"
                           : "border-2 border-[var(--border)]"
              }`}>
                {isDone   && <Check size={9} strokeWidth={3} />}
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />}
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

// ── Conversion Note Card ──────────────────────────────────────────────────────
function NoteCard({ note, index }) {
  return (
    <div className="premium-card p-4 space-y-3 hover:border-[var(--accent-secondary)] transition-all">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--accent-primary)_15%,transparent)] text-[var(--accent-primary)] text-[9px] font-black shrink-0">
          {index + 1}
        </span>
        <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">Conversion Change</span>
      </div>
      <div className="flex items-start gap-2">
        <div className="flex-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2.5 py-2">
          <div className="text-[9px] uppercase font-bold text-red-500 mb-1">Before</div>
          <code className="text-[11px] text-[var(--text-secondary)] font-mono whitespace-pre-wrap break-all">{note.from}</code>
        </div>
        <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0 mt-6" />
        <div className="flex-1 rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2.5 py-2">
          <div className="text-[9px] uppercase font-bold text-green-500 mb-1">After</div>
          <code className="text-[11px] text-[var(--text-primary)] font-mono whitespace-pre-wrap break-all">{note.to}</code>
        </div>
      </div>
      <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-2.5">
        <span className="font-bold text-[var(--text-primary)]">Why: </span>
        {note.reason}
      </div>
    </div>
  )
}

// ── Main ConvertWorkspace ─────────────────────────────────────────────────────
export function ConvertWorkspace() {
  // The converter has its OWN input state — doesn't depend on main codeStore
  const codeStoreCode     = useCodeStore(s => s.code)
  const codeStoreLang     = useCodeStore(s => s.language)

  const [inputCode, setInputCode] = useState(() => codeStoreCode || "")
  const [inputLangForMonaco, setInputLangForMonaco] = useState(codeStoreLang || "javascript")

  const sourceLang         = useConverterStore(s => s.sourceLang)
  const targetLang         = useConverterStore(s => s.targetLang)
  const conversionStyle    = useConverterStore(s => s.conversionStyle)
  const options            = useConverterStore(s => s.options)
  const originalCode       = useConverterStore(s => s.originalCode)
  const convertedCode      = useConverterStore(s => s.convertedCode)
  const detectedSourceLang = useConverterStore(s => s.detectedSourceLang)
  const isConverting       = useConverterStore(s => s.isConverting)
  const conversionNotes    = useConverterStore(s => s.conversionNotes)
  const activeTab          = useConverterStore(s => s.activeTab)
  const progress           = useConverterStore(s => s.progress)

  const setSourceLang       = useConverterStore(s => s.setSourceLang)
  const setTargetLang       = useConverterStore(s => s.setTargetLang)
  const setConversionStyle  = useConverterStore(s => s.setConversionStyle)
  const setActiveTab        = useConverterStore(s => s.setActiveTab)
  const setOption           = useConverterStore(s => s.setOption)
  const doRunConversion     = useConverterStore(s => s.runConversion)
  const applyConversion     = useConverterStore(s => s.applyConversion)
  const exportConvertedFile = useConverterStore(s => s.exportConvertedFile)
  const reset               = useConverterStore(s => s.reset)

  const resolvedTheme = useThemeStore(s => s.resolvedTheme)
  const monacoTheme   = resolvedTheme === "dark" ? "explainer-dark" : "explainer-light"

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900)
  const [showAdvanced, setShowAdvanced] = useState(false)
  // "input" = show input editor, "result" = show diff/converted
  const [viewState, setViewState] = useState(convertedCode ? "result" : "input")

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)")
    const handler = e => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Update Monaco language dynamically based on detected source or selection
  useEffect(() => {
    if (sourceLang !== "auto") {
      setInputLangForMonaco(sourceLang)
    }
  }, [sourceLang])

  const handleConvert = async () => {
    if (!inputCode.trim()) {
      toast.warning("Please paste or type some code first")
      return
    }
    const langToUse = sourceLang === "auto" ? codeStoreLang : sourceLang
    await doRunConversion(inputCode, langToUse)
    setViewState("result")
    toast.success("Conversion complete!")
  }

  const handleReset = () => {
    reset()
    setViewState("input")
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.trim()) {
        setInputCode(text)
        toast.success("Code pasted from clipboard")
      } else {
        toast.warning("Clipboard is empty")
      }
    } catch {
      toast.error("Could not read clipboard — paste manually with Ctrl+V")
    }
  }

  const handleApply = () => {
    applyConversion()
    toast.success(`Code applied as ${getLanguageLabel(targetLang)}`)
  }

  const handleCopy = async () => {
    if (!convertedCode) return
    try {
      await navigator.clipboard.writeText(convertedCode)
      toast.success("Converted code copied to clipboard")
    } catch {
      toast.error("Failed to copy code")
    }
  }

  const handleExport = () => {
    exportConvertedFile()
    toast.success("Converted file downloaded")
  }

  const hasResult  = !isConverting && convertedCode
  const showResult = viewState === "result"

  const STYLE_OPTIONS = [
    { id: "direct",     label: "Direct" },
    { id: "idiomatic",  label: "Idiomatic" },
    { id: "production", label: "Production" },
  ]

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full h-full min-h-0 bg-[var(--bg-primary)] overflow-hidden">

      {/* ────────────────────────────────────────────────────────────────────
          LEFT PANEL: Input editor OR Diff/Result view
      ──────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col w-full md:w-[60%] border-b md:border-b-0 md:border-r border-[var(--border)] h-[55vh] md:h-full min-h-0 bg-[var(--bg-secondary)]">

        {/* ── Toolbar ── */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] shrink-0 select-none gap-2 flex-wrap">

          {/* Left: tabs / title */}
          <div className="flex items-center gap-2 min-w-0">
            {!showResult || isConverting ? (
              /* Input state: just a label */
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]">
                  <Languages size={13} className="text-[var(--accent-primary)]" />
                </div>
                <span className="text-[11px] font-bold text-[var(--text-primary)]">Source Code</span>
                <span className="text-[10px] text-[var(--text-muted)]">— paste or type below</span>
              </div>
            ) : (
              /* Result state: tab switcher */
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-1 shadow-sm shrink-0">
                  {["comparison", "converted"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                        activeTab === tab
                          ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {tab === "comparison" ? "Comparison" : "Converted Code"}
                    </button>
                  ))}
                </div>
                {/* Language route badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]">
                    {getLanguageLabel(detectedSourceLang || codeStoreLang)}
                  </span>
                  <ArrowRight size={12} className="text-[var(--text-muted)]" />
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] border border-[var(--accent-primary)]/30 text-[var(--accent-primary)]">
                    {getLanguageLabel(targetLang)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {!showResult && !isConverting && (
              /* Input state actions */
              <button
                onClick={handlePasteFromClipboard}
                className="flex items-center gap-1.5 text-[10px] font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
              >
                <Clipboard size={12} />
                Paste
              </button>
            )}
            {hasResult && showResult && (
              /* Result state actions */
              <>
                <button
                  onClick={handleReset}
                  title="Edit source code"
                  className="flex items-center gap-1.5 text-[10px] font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">New</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-[10px] font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                >
                  <Copy size={12} />
                  <span className="hidden sm:inline">Copy</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 text-[10px] font-semibold rounded px-2.5 py-1.5 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                >
                  <Download size={12} />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 text-[10px] font-bold rounded px-2.5 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-colors cursor-pointer"
                >
                  <Check size={12} strokeWidth={2.5} />
                  Apply
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Editor / Result Area ── */}
        <div className="flex-1 min-h-0 relative">

          {/* CONVERTING — spinner / progress */}
          {isConverting && (
            progress
              ? <ProgressOverlay progress={progress} />
              : (
                <div className="flex flex-col items-center justify-center gap-3 h-full w-full">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[var(--bg-tertiary)]" />
                    <div className="absolute inset-0 rounded-full border-4 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                    <Languages size={20} className="text-[var(--accent-primary)]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">Converting code…</p>
                </div>
              )
          )}

          {/* INPUT — Monaco editor for source code */}
          {!isConverting && !showResult && (
            <Editor
              value={inputCode}
              language={inputLangForMonaco}
              theme={monacoTheme}
              onMount={defineThemeOnMount}
              onChange={(val) => setInputCode(val || "")}
              options={{
                fontSize: 13,
                lineHeight: 21,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                placeholder: "// Paste or type your source code here…",
              }}
            />
          )}

          {/* RESULT — Comparison DiffEditor */}
          {!isConverting && showResult && activeTab === "comparison" && (
            <DiffEditor
              original={originalCode}
              modified={convertedCode}
              language={targetLang}
              theme={monacoTheme}
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
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              }}
            />
          )}

          {/* RESULT — Converted code only */}
          {!isConverting && showResult && activeTab === "converted" && (
            <Editor
              value={convertedCode}
              language={targetLang}
              theme={monacoTheme}
              onMount={defineThemeOnMount}
              options={{
                readOnly: true,
                fontSize: 12,
                lineHeight: 20,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              }}
            />
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────
          RIGHT PANEL: Config + Conversion Notes
      ──────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col w-full md:w-[40%] flex-1 md:h-full min-h-0 bg-[var(--bg-primary)] overflow-y-auto">

        {/* ── Conversion Config ──────────────────────────────────────────── */}
        <div className="p-5 border-b border-[var(--border)] space-y-5 shrink-0">

          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)]">
              <ArrowLeftRight size={16} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">Code Converter</h2>
              <p className="text-[10px] text-[var(--text-muted)]">Translate code between languages with idiomatic output</p>
            </div>
          </div>

          {/* Language selectors */}
          <div className="flex items-end gap-3">
            <LangDropdown
              label="Source Language"
              value={sourceLang}
              onChange={setSourceLang}
              includeAuto
            />
            <div className="flex flex-col items-center justify-end pb-2.5 shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <ArrowRight size={13} className="text-[var(--text-muted)]" />
              </div>
            </div>
            <LangDropdown
              label="Target Language"
              value={targetLang}
              onChange={setTargetLang}
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Options</div>
            <div className="space-y-2">
              {[
                { key: "preserveComments",      label: "Preserve comments" },
                { key: "preserveVariableNames", label: "Preserve variable names" },
                { key: "preserveCodeStyle",     label: "Preserve code style" },
                { key: "generateIdiomatic",     label: "Generate idiomatic code" },
                { key: "addBestPractices",      label: "Add language-specific best practices" },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setOption(opt.key, !options[opt.key])}
                    className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-all cursor-pointer ${
                      options[opt.key]
                        ? "bg-[var(--accent-primary)] border-[var(--accent-primary)]"
                        : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)]"
                    }`}
                  >
                    {options[opt.key] && <Check size={9} strokeWidth={3} className="text-[var(--accent-on)]" />}
                  </div>
                  <span
                    onClick={() => setOption(opt.key, !options[opt.key])}
                    className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors select-none"
                  >
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Advanced Mode */}
          <div>
            <button
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-2 text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <Settings2 size={13} />
              Advanced Mode
              <ChevronDown size={12} className={`transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-2.5 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Conversion Style</div>
                <div className="flex gap-2">
                  {STYLE_OPTIONS.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setConversionStyle(style.id)}
                      className={`flex-1 text-[10px] font-bold px-2 py-2 rounded-lg border transition-all cursor-pointer ${
                        conversionStyle === style.id
                          ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-on)]"
                          : "border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                  {conversionStyle === "direct"     && "Direct Translation — minimal changes, preserves original structure closely."}
                  {conversionStyle === "idiomatic"  && "Idiomatic — uses language-native patterns, idioms, and conventions."}
                  {conversionStyle === "production" && "Production Ready — adds error handling, module structure, imports, and best practices."}
                </div>
              </div>
            )}
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer shadow-lg shadow-[var(--accent-primary)]/20"
          >
            {isConverting
              ? <><Loader2 size={16} className="animate-spin" /> Converting…</>
              : <><Sparkles size={16} /> Convert Code</>
            }
          </button>

          {/* Detected language hint */}
          {sourceLang === "auto" && detectedSourceLang && !isConverting && (
            <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2">
              <Info size={12} className="text-[var(--accent-primary)] shrink-0" />
              Detected source language:
              <strong className="text-[var(--text-primary)] ml-1">{getLanguageLabel(detectedSourceLang)}</strong>
            </div>
          )}
        </div>

        {/* ── Conversion Notes ──────────────────────────────────────────── */}
        {hasResult && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Conversion Notes</h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {conversionNotes.length} key change{conversionNotes.length !== 1 ? "s" : ""} applied
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg px-2.5 py-1">
                <Check size={11} strokeWidth={3} />
                Converted
              </div>
            </div>

            {conversionNotes.length === 0 && (
              <div className="text-center text-[11px] text-[var(--text-muted)] py-6 border border-dashed border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
                No significant changes were detected between the two versions.
              </div>
            )}

            <div className="space-y-3">
              {conversionNotes.map((note, i) => (
                <NoteCard key={note.id} note={note} index={i} />
              ))}
            </div>

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/50 text-[10px] text-blue-700 dark:text-blue-400">
              <Info size={13} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                Conversion preserves the original logic and structure.
                For complex codebases, manual review of idioms and type annotations is recommended.
              </span>
            </div>

            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Check size={14} strokeWidth={2.5} />
              Apply Conversion to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
