import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts"
import { Lightbulb } from "lucide-react"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"
import { growthData, ratingColor } from "../../utils/complexityAnalyzer.js"

export function ComplexityTab({ explanation, complexity, depth }) {
  const oc = explanation.overall_complexity
  const time = complexity?.time || oc.time
  const space = complexity?.space || oc.space
  const rating = complexity?.rating || "good"
  const color = ratingColor(rating)
  const data = growthData(time)

  return (
    <div className="space-y-4">
      <Card title="Big-O Complexity">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[130px] rounded bg-[var(--bg-tertiary)] p-3">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Time complexity
            </div>
            <div className="text-2xl font-mono font-bold" style={{ color }}>
              {time}
            </div>
          </div>
          <div className="flex-1 min-w-[130px] rounded bg-[var(--bg-tertiary)] p-3">
            <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wide mb-1">
              Space complexity
            </div>
            <div className="text-2xl font-mono font-bold" style={{ color }}>
              {space}
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3">{oc.explanation}</p>
        {oc.comparison && (
          <p className="text-xs text-[var(--text-muted)] mt-2 italic">{oc.comparison}</p>
        )}
      </Card>

      <Card title="Growth Curve">
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Operations as input size n increases (current: {time})
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="n"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                stroke="var(--border)"
                label={{ value: "n", position: "insideBottomRight", offset: -2, fontSize: 11, fill: "var(--text-muted)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                stroke="var(--border)"
                width={48}
              />
              <RTooltip
                contentStyle={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Line
                type="monotone"
                dataKey="operations"
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Breakdown by Section" accent={false}>
        <div className="space-y-2">
          {oc.breakdown.map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between rounded bg-[var(--bg-tertiary)] px-3 py-2"
            >
              <span className="text-sm text-[var(--text-primary)]">{b.name}</span>
              <div className="flex items-center gap-2">
                <Badge type="outline" size="sm">
                  Time {b.time}
                </Badge>
                <Badge type="outline" size="sm">
                  Space {b.space}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {oc.optimization && (
        <Card title={depth === "expert" ? "Expert Optimization Notes" : depth === "beginner" ? "Tips for Improvement" : "Optimization Suggestion"}>
          <p className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            <Lightbulb size={15} className="mt-0.5 shrink-0" style={{ color: "var(--accent-secondary)" }} />
            {oc.optimization}
          </p>
        </Card>
      )}
    </div>
  )
}
