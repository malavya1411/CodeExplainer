import { cn } from "../../utils/cn.js"

export function Card({ title, accent = true, action, children, className, ...props }) {
  return (
    <div
      className={cn(
        "premium-card",
        "hover:border-[var(--accent-secondary)] hover:-translate-y-0.5 hover:shadow-md",
        accent && "border-l-4 border-l-[var(--accent-primary)]",
        className,
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          {title && (
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
          )}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
