import { Clock, Lightbulb, AlertTriangle, BookOpen, Zap, Code2 } from "lucide-react"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"

const DIFFICULTY = {
  beginner: { type: "success", label: "Beginner" },
  intermediate: { type: "info", label: "Intermediate" },
  advanced: { type: "warning", label: "Advanced" },
  expert: { type: "warning", label: "Expert" },
}

const DEPTH_META = {
  beginner: {
    icon: BookOpen,
    label: "Beginner Explanation",
    hint: "Simple language with real-world analogies",
    color: "var(--success)",
  },
  intermediate: {
    icon: Code2,
    label: "Intermediate Explanation",
    hint: "Logic flow, variables, and algorithm tradeoffs",
    color: "var(--accent-primary)",
  },
  expert: {
    icon: Zap,
    label: "Expert Explanation",
    hint: "Deep technical analysis, optimizations, and production considerations",
    color: "var(--warning)",
  },
}

export function OverviewTab({ explanation, complexity, depth }) {
  const diff = DIFFICULTY[explanation.difficulty] || DIFFICULTY.intermediate
  const time = complexity?.time || explanation.overall_complexity.time
  const space = complexity?.space || explanation.overall_complexity.space
  const meta = DEPTH_META[depth] || DEPTH_META.intermediate
  const MetaIcon = meta.icon

  return (
    <div className="space-y-4">
      {/* Depth indicator badge */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium"
        style={{
          background: `color-mix(in srgb, ${meta.color} 8%, transparent)`,
          borderColor: `color-mix(in srgb, ${meta.color} 30%, transparent)`,
          color: meta.color,
        }}
      >
        <MetaIcon size={13} />
        <span>{meta.label}</span>
        <span className="text-[var(--text-muted)] font-normal">— {meta.hint}</span>
      </div>

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

      {/* Code blocks with depth-specific text */}
      {explanation.blocks?.length > 0 && (
        <Card title="Code Walkthrough">
          <div className="space-y-3">
            {explanation.blocks.map((block) => {
              const text =
                block._displayText ||
                block[depth] ||
                block.intermediate ||
                block.beginner ||
                ""
              return (
                <div
                  key={block.id}
                  className="rounded-lg bg-[var(--bg-tertiary)] p-3 border border-[var(--border)]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                      L{block.line_start}
                      {block.line_end !== block.line_start ? `–${block.line_end}` : ""}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {block.title}
                    </span>
                    <Badge type="outline" size="sm">
                      {block.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
                  {block.analogy && depth === "beginner" && (
                    <p className="flex items-center gap-1.5 text-xs text-[var(--accent-secondary)] mt-2">
                      <Lightbulb size={11} />
                      {block.analogy}
                    </p>
                  )}
                  {block.key_concepts?.length > 0 && depth !== "beginner" && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {block.key_concepts.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] font-mono"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

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
