import { useRef, useEffect, useCallback } from "react"
import Editor, { loader } from "@monaco-editor/react"
import { useThemeStore } from "../../stores/themeStore.js"
import { useAnnotationStore } from "../../stores/annotationStore.js"
import { useCommentStore } from "../../stores/commentStore.js"
import { getMonacoLanguage } from "../../utils/languageDetector.js"

export function CodeEditor({ value, language, onChange, highlightLine, highlightRange, onCursorLine, onSelectionText }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const decorationsRef = useRef([])
  const viewZonesRef = useRef([])
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const annotations = useAnnotationStore((s) => s.annotations)
  const confusingLines = useAnnotationStore((s) => s.confusingLines)
  const openPanel = useAnnotationStore((s) => s.openPanel)

  const showInlineComments = useCommentStore((s) => s.showInlineComments)
  const commentedCode = useCommentStore((s) => s.commentedCode)
  const commentSettings = useCommentStore((s) => s.commentSettings)

  const defineThemes = (monaco) => {
    monaco.editor.defineTheme("explainer-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "D9A96A" },
        { token: "string", foreground: "9DC7E5" },
        { token: "number", foreground: "D8B25C" },
        { token: "comment", foreground: "6D726D", fontStyle: "italic" },
        { token: "type.identifier", foreground: "89BFA0" },
        { token: "variable", foreground: "F1EEE5" },
      ],
      colors: {
        "editor.background": "#151816",
        "editor.foreground": "#F5F4EE",
        "editorLineNumber.foreground": "#2A2F2B",
        "editorLineNumber.activeForeground": "#B5B4AB",
        "editor.lineHighlightBackground": "#1B1F1C",
        "editorGutter.background": "#151816",
      },
    })
    monaco.editor.defineTheme("explainer-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8C472B" },
        { token: "string", foreground: "3E6B4E" },
        { token: "number", foreground: "A87D25" },
        { token: "comment", foreground: "999990", fontStyle: "italic" },
        { token: "type.identifier", foreground: "2D6A4F" },
      ],
      colors: {
        "editor.background": "#FAF9F5",
        "editor.foreground": "#3A3A35",
        "editorLineNumber.foreground": "#D8D1BE",
        "editorLineNumber.activeForeground": "#6B6B63",
        "editor.lineHighlightBackground": "#F3F0E2",
        "editorGutter.background": "#FAF9F5",
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

    if (highlightRange && highlightRange.startLine <= total) {
      const { startLine, endLine } = highlightRange
      decos.push({
        range: new monaco.Range(startLine, 1, Math.min(endLine, total), 1),
        options: {
          isWholeLine: true,
          className: "exp-active-line",
          linesDecorationsClassName: "exp-active-line-margin",
        },
      })
    } else if (highlightLine && highlightLine <= total) {
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
  }, [highlightLine, highlightRange, annotations, confusingLines])

  useEffect(() => {
    updateDecorations()
  }, [updateDecorations])

  useEffect(() => {
    if (highlightRange && editorRef.current) {
      editorRef.current.revealLineInCenterIfOutsideViewport(highlightRange.startLine)
    } else if (highlightLine && editorRef.current) {
      editorRef.current.revealLineInCenterIfOutsideViewport(highlightLine)
    }
  }, [highlightRange, highlightLine])

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(resolvedTheme === "dark" ? "explainer-dark" : "explainer-light")
    }
  }, [resolvedTheme])

  useEffect(() => {
    const editor = editorRef.current
    if (editor && value) {
      const currentVal = editor.getValue()
      if (currentVal !== value) {
        const position = editor.getPosition()
        const scroll = editor.getScrollTop()
        setTimeout(() => {
          if (editorRef.current) {
            if (position) {
              editorRef.current.setPosition(position)
            }
            editorRef.current.setScrollTop(scroll)
          }
        }, 50)
      }
    }
  }, [value])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const clearViewZones = () => {
      if (viewZonesRef.current.length > 0) {
        editor.changeViewZones((changeAccessor) => {
          viewZonesRef.current.forEach((id) => {
            changeAccessor.removeZone(id)
          })
        })
        viewZonesRef.current = []
      }
    }

    if (!showInlineComments || !commentedCode || !value) {
      clearViewZones()
      return
    }

    const lineMap = mapCommentsToLines(value, commentedCode, language)
    const depth = commentSettings.depth || "intermediate"
    const commentColor = `var(--comment-${depth})`
    const docstringColor = "var(--comment-docstring)"

    clearViewZones()

    editor.changeViewZones((changeAccessor) => {
      const ids = []
      
      Object.entries(lineMap).forEach(([lineNumStr, info]) => {
        const lineNum = parseInt(lineNumStr, 10)
        
        if (info.blockComments && info.blockComments.length > 0) {
          const domNode = document.createElement("div")
          domNode.className = "ghost-comment-zone"
          
          info.blockComments.forEach((c) => {
            const lineEl = document.createElement("div")
            lineEl.className = "ghost-comment-line"
            lineEl.textContent = c
            
            const isDoc = c.trim().startsWith("/**") || c.trim().startsWith("*") || c.trim().startsWith('"""')
            lineEl.style.color = isDoc ? docstringColor : commentColor
            domNode.appendChild(lineEl)
          })
          
          const zoneId = changeAccessor.addZone({
            afterLineNumber: lineNum - 1,
            heightInLines: info.blockComments.length,
            domNode: domNode,
          })
          ids.push(zoneId)
        }

        if (info.inlineComment) {
          const domNode = document.createElement("div")
          domNode.className = "ghost-comment-zone"
          
          const lineEl = document.createElement("div")
          lineEl.className = "ghost-comment-line"
          
          const prefix = language === "python" ? "#" : "//"
          const origLine = value.split("\n")[lineNum - 1] || ""
          const indentMatch = origLine.match(/^\s*/)
          const indent = indentMatch ? indentMatch[0] : ""
          
          lineEl.textContent = `${indent}${prefix} ${info.inlineComment}`
          lineEl.style.color = commentColor
          domNode.appendChild(lineEl)

          const zoneId = changeAccessor.addZone({
            afterLineNumber: lineNum,
            heightInLines: 1,
            domNode: domNode,
          })
          ids.push(zoneId)
        }
      })
      
      viewZonesRef.current = ids
    })

    return () => {
      clearViewZones()
    }
  }, [showInlineComments, commentedCode, value, language, commentSettings.depth])

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

function mapCommentsToLines(originalCode, commentedCode, language) {
  const originalLines = originalCode.split("\n")
  const commentedLines = commentedCode.split("\n")
  
  const isPython = language === "python"
  
  const cleanLine = (line) => {
    let l = line.trim()
    if (isPython) {
      if (l.startsWith("#")) return ""
      if (l.startsWith('"""')) return ""
      const hashIdx = l.indexOf("#")
      if (hashIdx !== -1) {
        l = l.substring(0, hashIdx).trim()
      }
    } else {
      if (l.startsWith("//")) return ""
      if (l.startsWith("/*") || l.startsWith("*") || l.endsWith("*/")) return ""
      const doubleSlashIdx = l.indexOf("//")
      if (doubleSlashIdx !== -1) {
        l = l.substring(0, doubleSlashIdx).trim()
      }
    }
    return l
  }

  const lineMap = {}
  for (let i = 1; i <= originalLines.length; i++) {
    lineMap[i] = { blockComments: [], inlineComment: "" }
  }

  let origIdx = 0
  let commIdx = 0
  let accumulatedComments = []

  while (commIdx < commentedLines.length && origIdx < originalLines.length) {
    const originalLineRaw = originalLines[origIdx]
    const commentedLineRaw = commentedLines[commIdx]
    
    const cleanedOriginal = cleanLine(originalLineRaw)
    const cleanedCommented = cleanLine(commentedLineRaw)
    
    if (cleanedCommented === "") {
      accumulatedComments.push(commentedLineRaw)
      commIdx++
    } else if (cleanedOriginal === "") {
      if (cleanedCommented === "") {
        commIdx++
      }
      origIdx++
    } else if (cleanedOriginal === cleanedCommented) {
      if (accumulatedComments.length > 0) {
        lineMap[origIdx + 1].blockComments = [...accumulatedComments]
        accumulatedComments = []
      }
      
      const commentMarker = isPython ? "#" : "//"
      const markerIdx = commentedLineRaw.indexOf(commentMarker)
      if (markerIdx !== -1 && !commentedLineRaw.trim().startsWith(commentMarker)) {
        const potentialComment = commentedLineRaw.substring(markerIdx + commentMarker.length).trim()
        if (originalLineRaw.indexOf(commentMarker) === -1) {
          lineMap[origIdx + 1].inlineComment = potentialComment
        }
      }
      
      origIdx++
      commIdx++
    } else {
      commIdx++
    }
  }
  
  return lineMap
}
