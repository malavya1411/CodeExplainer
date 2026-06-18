import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { Card } from "../shared/Card.jsx"
import { Badge } from "../shared/Badge.jsx"
import { cn } from "../../utils/cn.js"

const FILTERS = ["All", "Local", "Global", "Changed"]

export function VariablesTab({ explanation, currentStep, depth }) {
  const [filter, setFilter] = useState("All")
  const [query, setQuery] = useState("")
  const variables = explanation.variables || []

  const changedNames = useMemo(() => {
    const set = new Set()
    const steps = explanation.execution_steps
    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      Object.keys(steps[i].state_changes || {}).forEach((k) => set.add(k))
    }
    return set
  }, [explanation, currentStep])

  const filtered = variables.filter((v) => {
    if (query && !v.name.toLowerCase().includes(query.toLowerCase())) return false
    if (filter === "Local") return v.scope === "local"
    if (filter === "Global") return v.scope === "global" || v.scope === "parameter"
    if (filter === "Changed") return changedNames.has(v.name)
    return true
  })

  return (
    <div className="space-y-4">
      <Card accent={false} className="hover:translate-y-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search variables…"
              aria-label="Search variables"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-tertiary)] p-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors",
                  filter === f
                    ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Variables" accent={false}>
        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No variables match this filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--text-muted)] border-b border-[var(--border)]">
                  <th className="py-2 pr-3 font-medium">Name</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 pr-3 font-medium">Value</th>
                  <th className="py-2 pr-3 font-medium">Scope</th>
                  <th className="py-2 font-medium">Changed</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.name} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2 pr-3">
                      <div className="font-mono text-[var(--accent-primary)]">{v.name}</div>
                      {v.description && (
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-snug max-w-[180px]">
                          {v.description}
                        </div>
                      )}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-[var(--text-secondary)]">{v.type}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-[var(--text-primary)]">{v.value}</td>
                    <td className="py-2 pr-3">
                      <Badge type="outline" size="sm">
                        {v.scope}
                      </Badge>
                    </td>
                    <td className="py-2 text-xs text-[var(--text-muted)]">step {v.lastChanged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ArrayVisualizer variables={variables} />
    </div>
  )
}

function ArrayVisualizer({ variables }) {
  const arrays = variables.filter((v) => v.value.trim().startsWith("["))
  if (arrays.length === 0) return null

  return (
    <Card title="Array Visualization">
      <div className="space-y-4">
        {arrays.map((v) => {
          let items = []
          try {
            items = JSON.parse(v.value)
          } catch {
            items = v.value.replace(/[[\]]/g, "").split(",").map((s) => s.trim())
          }
          const max = Math.max(...items.map((n) => (typeof n === "number" ? n : 1)), 1)
          return (
            <div key={v.name}>
              <div className="text-xs font-mono text-[var(--text-secondary)] mb-2">{v.name}</div>
              <div className="flex items-end gap-1.5 h-28">
                {items.map((item, idx) => {
                  const h = typeof item === "number" ? (item / max) * 100 : 40
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]">
                      <div
                        className="w-full rounded-t bg-[var(--accent-secondary)] transition-all flex items-start justify-center"
                        style={{ height: `${Math.max(h, 8)}%` }}
                      >
                        <span className="text-[10px] font-mono text-[var(--accent-on)] mt-0.5">{item}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{idx}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
