import { useState, useEffect } from "react"
import { HelpCircle } from "lucide-react"
import { useAnnotationStore } from "../../stores/annotationStore.js"
import { SlideOutPanel } from "../shared/SlideOutPanel.jsx"
import { Button } from "../shared/Button.jsx"
import { toast } from "../shared/Toast.jsx"

export function AnnotationPanel() {
  const panelOpen = useAnnotationStore((s) => s.panelOpen)
  const activeLine = useAnnotationStore((s) => s.activeLine)
  const annotations = useAnnotationStore((s) => s.annotations)
  const confusingLines = useAnnotationStore((s) => s.confusingLines)
  const closePanel = useAnnotationStore((s) => s.closePanel)
  const addAnnotation = useAnnotationStore((s) => s.addAnnotation)
  const toggleConfusing = useAnnotationStore((s) => s.toggleConfusing)

  const [text, setText] = useState("")

  useEffect(() => {
    if (activeLine !== null) {
      setText(annotations[activeLine] || "")
    }
  }, [activeLine, annotations])

  const handleSave = () => {
    if (activeLine === null) return
    addAnnotation(activeLine, text)
    toast.success(text.trim() ? "Annotation saved" : "Annotation removed")
    closePanel()
  }

  const isConfusing = confusingLines.includes(activeLine)

  return (
    <SlideOutPanel
      direction="left"
      isOpen={panelOpen}
      onClose={closePanel}
      title={`Annotate Line ${activeLine}`}
      width="300px"
    >
      <div className="flex flex-col gap-3 h-full">
        <p className="text-xs text-[var(--text-muted)]">
          Add a note for line {activeLine}. Notes persist in your browser session.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your annotation…"
          rows={6}
          aria-label={`Annotation for line ${activeLine}`}
          className="w-full rounded border border-[var(--border)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] p-2.5 resize-none focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
        />

        <button
          onClick={() => activeLine !== null && toggleConfusing(activeLine)}
          className={
            "flex items-center gap-2 rounded px-3 py-2 text-xs font-medium border transition-colors " +
            (isConfusing
              ? "bg-[color-mix(in_srgb,var(--warning)_15%,transparent)] border-[var(--warning)] text-[var(--warning)]"
              : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--warning)] hover:text-[var(--warning)]")
          }
          aria-pressed={isConfusing}
        >
          <HelpCircle size={14} />
          {isConfusing ? "Marked as confusing" : "Mark line as confusing"}
        </button>

        <div className="flex gap-2 mt-auto">
          <Button variant="primary" size="sm" onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button variant="secondary" size="sm" onClick={closePanel} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </SlideOutPanel>
  )
}
