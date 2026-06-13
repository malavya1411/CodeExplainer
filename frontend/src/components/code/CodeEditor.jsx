import { useRef, useEffect, useCallback } from "react"
import Editor, { loader } from "@monaco-editor/react"
import { useThemeStore } from "../../stores/themeStore.js"
import { useAnnotationStore } from "../../stores/annotationStore.js"
import { getMonacoLanguage } from "../../utils/languageDetector.js"

export function CodeEditor({ value, language, onChange, highlightLine, onCursorLine, onSelectionText }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const decorationsRef = useRef([])
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const annotations = useAnnotationStore((s) => s.annotations)
  const confusingLines = useAnnotationStore((s) => s.confusingLines)
  const openPanel = useAnnotationStore((s) => s.openPanel)

  const defineThemes = (monaco) => {
    monaco.editor.defineTheme("explainer-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "FF7B72" },
        { token: "string", foreground: "A5D6FF" },
        { token: "number", foreground: "79C0FF" },
        { token: "comment", foreground: "8B949E", fontStyle: "italic" },
        { token: "type.identifier", foreground: "D2A8FF" },
      ],
      colors: {
        "editor.background": "#161B22",
        "editor.foreground": "#C9D1D9",
        "editorLineNumber.foreground": "#6E7681",
        "editorLineNumber.activeForeground": "#C9D1D9",
        "editor.lineHighlightBackground": "#21262D",
        "editorGutter.background": "#161B22",
      },
    })
    monaco.editor.defineTheme("explainer-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "D73A49" },
        { token: "string", foreground: "032F62" },
        { token: "number", foreground: "005CC5" },
        { token: "comment", foreground: "6A737D", fontStyle: "italic" },
        { token: "type.identifier", foreground: "6F42C1" },
      ],
      colors: {
        "editor.background": "#F1F3F5",
        "editor.foreground": "#1A1D23",
        "editorLineNumber.foreground": "#ADB5BD",
        "editorLineNumber.activeForeground": "#495057",
        "editor.lineHighlightBackground": "#E9ECEF",
        "editorGutter.background": "#F1F3F5",
      },
    })
  }

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    defineThemes(monaco)
    monaco.editor.setTheme(resolvedTheme === "dark" ? "explainer-dark" : "explainer-light")

    editor.onDidChangeCursorPosition((e) => {
      onCursorLine?.(e.position.lineNumber)
    })

    editor.onDidChangeCursorSelection((e) => {
      const text = editor.getModel()?.getValueInRange(e.selection) || ""
      onSelectionText?.(text)
    })

    // Click on the glyph / line number margin to open annotation panel.
    editor.onMouseDown((e) => {
      const t = e.target.type
      if (
        t === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS ||
        t === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN
      ) {
        const line = e.target.position?.lineNumber
        if (line) openPanel(line)
      }
    })

    updateDecorations()
  }

  const updateDecorations = useCallback(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return
    const model = editor.getModel()
    if (!model) return
    const total = model.getLineCount()
    const decos = []

    if (highlightLine && highlightLine <= total) {
      decos.push({
        range: new monaco.Range(highlightLine, 1, highlightLine, 1),
        options: {
          isWholeLine: true,
          className: "exp-active-line",
          linesDecorationsClassName: "exp-active-line-margin",
        },
      })
    }

    Object.keys(annotations).forEach((ln) => {
      const n = Number(ln)
      if (n <= total) {
        decos.push({
          range: new monaco.Range(n, 1, n, 1),
          options: {
            glyphMarginClassName: "exp-annotation-glyph",
            glyphMarginHoverMessage: { value: annotations[ln] },
          },
        })
      }
    })

    confusingLines.forEach((n) => {
      if (n <= total) {
        decos.push({
          range: new monaco.Range(n, 1, n, 1),
          options: { linesDecorationsClassName: "exp-confusing-margin" },
        })
      }
    })

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decos)
  }, [highlightLine, annotations, confusingLines])

  useEffect(() => {
    updateDecorations()
  }, [updateDecorations])

  useEffect(() => {
    if (highlightLine && editorRef.current) {
      editorRef.current.revealLineInCenterIfOutsideViewport(highlightLine)
    }
  }, [highlightLine])

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(resolvedTheme === "dark" ? "explainer-dark" : "explainer-light")
    }
  }, [resolvedTheme])

  return (
    <div className="flex-1 min-h-0 relative">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        loading={
          <div className="flex items-center justify-center h-full text-sm text-[var(--text-muted)]">
            Loading editor…
          </div>
        }
        options={{
          fontSize: 13,
          lineHeight: 21,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: true, scale: 1 },
          lineNumbers: "on",
          glyphMargin: true,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          renderLineHighlight: "all",
          padding: { top: 12, bottom: 12 },
          tabSize: 2,
          automaticLayout: true,
          wordWrap: "on",
          scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
        }}
      />
    </div>
  )
}
