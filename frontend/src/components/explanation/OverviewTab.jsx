import { Clock, Lightbulb, AlertTriangle } from "lucide-react"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"

const DIFFICULTY = {
  beginner: { type: "success", label: "Beginner" },
  intermediate: { type: "info", label: "Intermediate" },
  advanced: { type: "warning", label: "Advanced" },
  expert: { type: "warning", label: "Advanced" },
}

export function OverviewTab({ explanation, complexity }) {
  const diff = DIFFICULTY[explanation.difficulty] || DIFFICULTY.intermediate
  const time = complexity?.time || explanation.overall_complexity.time
  const space = complexity?.space || explanation.overall_complexity.space

  return (
    <div className="space-y-4">
      <Card title="Summary">
        <p className="text-base text-[var(--text-primary)] leading-relaxed text-pretty">
          {explanation.summary}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge type={diff.type} size="md">
            {diff.label}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock size={13} />
            Estimated read time: {explanation.estimatedReadMinutes} min
          </span>
        </div>
      </Card>

      <Card title="Key Concepts">
        <div className="flex flex-wrap gap-2">
          {explanation.patterns_detected.map((c) => (
            <Badge key={c} type="neutral" size="md">
              {c}
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="Overall Complexity">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[120px] rounded bg-[var(--bg-tertiary)] p-3">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Time
            </div>
            <div className="text-lg font-mono font-bold text-[var(--accent-primary)]">{time}</div>
          </div>
          <div className="flex-1 min-w-[120px] rounded bg-[var(--bg-tertiary)] p-3">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Space
            </div>
            <div className="text-lg font-mono font-bold text-[var(--accent-primary)]">{space}</div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3">
          {explanation.overall_complexity.explanation}
        </p>
      </Card>

      {explanation.potential_issues?.length > 0 && (
        <Card title="Potential Issues">
          <ul className="space-y-2">
            {explanation.potential_issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--warning)" }}
                />
                <span className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-primary)] font-medium">Line {issue.line}:</span>{" "}
                  {issue.description}
                  <span className="block text-[var(--accent-secondary)] mt-0.5 flex items-center gap-1">
                    <Lightbulb size={12} /> {issue.suggestion}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
