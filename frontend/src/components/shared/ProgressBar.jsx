import { cn } from "../../utils/cn.js"

const COLORS = {
  accent: "bg-[var(--accent-primary)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  error: "bg-[var(--error)]",
}

const HEIGHTS = { sm: "h-1", md: "h-1.5", lg: "h-2.5" }

export function ProgressBar({ value = 0, max = 100, size = "sm", color = "accent", className }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div
      className={cn("w-full rounded-full bg-[var(--bg-tertiary)] overflow-hidden", HEIGHTS[size], className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-100", COLORS[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
