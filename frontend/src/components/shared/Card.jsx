import { cn } from "../../utils/cn.js"

export function Card({ title, accent = true, action, children, className, ...props }) {
  return (
    <div
      className={cn(
        "rounded bg-[var(--bg-secondary)] border border-[var(--border)] transition-all",
        "hover:border-[var(--accent-primary)] hover:-translate-y-0.5",
        accent && "border-l-4 border-l-[var(--accent-primary)]",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--border)]">
          {title && (
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
