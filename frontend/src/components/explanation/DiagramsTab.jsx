import { useState, useRef } from "react"
import { Minus, Plus, Maximize, Download } from "lucide-react"
import { Card } from "../shared/Card.jsx"
import { IconButton, Tooltip } from "../shared/IconButton.jsx"
import { MermaidDiagram } from "../diagrams/MermaidDiagram.jsx"
import { toast } from "../shared/Toast.jsx"
import { cn } from "../../utils/cn.js"

const DIAGRAM_TABS = [
  { id: "flowchart", label: "Flowchart" },
  { id: "sequence", label: "Sequence" },
  { id: "classDiagram", label: "Class" },
]

export function DiagramsTab({ explanation }) {
  const [active, setActive] = useState("flowchart")
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef(null)
  const diagrams = explanation.diagrams

  const downloadSvg = () => {
    const svg = containerRef.current?.querySelector("svg")
    if (!svg) {
      toast.error("No diagram to download")
      return
    }
    const data = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([data], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${active}-diagram.svg`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Diagram downloaded")
  }

  return (
    <div className="space-y-4">
      <Card accent={false} className="hover:translate-y-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-tertiary)] p-0.5">
            {DIAGRAM_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                aria-pressed={active === t.id}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  active === t.id
                    ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5">
            <Tooltip content="Zoom out">
              <IconButton icon={Minus} label="Zoom out" size={15} onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))} />
            </Tooltip>
            <span className="text-[11px] font-mono text-[var(--text-muted)] w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Tooltip content="Zoom in">
              <IconButton icon={Plus} label="Zoom in" size={15} onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} />
            </Tooltip>
            <Tooltip content="Fit">
              <IconButton icon={Maximize} label="Fit to view" size={15} onClick={() => setZoom(1)} />
            </Tooltip>
            <Tooltip content="Download SVG">
              <IconButton icon={Download} label="Download diagram as SVG" size={15} onClick={downloadSvg} />
            </Tooltip>
          </div>
        </div>
      </Card>

      <Card accent={false}>
        <div className="overflow-auto rounded bg-[var(--bg-code)] p-4 min-h-[280px] flex items-center justify-center">
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.15s ease" }}
          >
            <MermaidDiagram
              key={active}
              definition={diagrams[active]}
              ariaLabel={`${active} diagram of the analyzed code`}
            />
          </div>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-3 text-center">
          {active === "flowchart" && "Execution flow: start, decisions, loops, and exit points."}
          {active === "sequence" && "Call sequence between the caller, function, and data."}
          {active === "classDiagram" && "Structure of the module and its methods."}
        </p>
      </Card>
    </div>
  )
}
