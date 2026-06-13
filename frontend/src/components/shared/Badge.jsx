import { cn } from "../../utils/cn.js"

const TYPE_STYLES = {
  success: "bg-[var(--success)] text-[var(--accent-on)]",
  warning: "bg-[var(--warning)] text-[var(--text-primary)]",
  error: "bg-[var(--error)] text-white",
  info: "bg-[var(--info)] text-white",
  neutral: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  outline:
    "bg-transparent text-[var(--text-secondary)] border border-[var(--border)]",
}

const SIZES = {
  sm: "text-[11px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
  lg: "text-sm px-3 py-1.5",
}

export function Badge({ type = "neutral", size = "md", pulse = false, className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap",
        TYPE_STYLES[type],
        SIZES[size],
        pulse && "animate-badge-pulse",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
