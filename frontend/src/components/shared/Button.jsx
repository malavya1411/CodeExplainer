import { cn } from "../../utils/cn.js"

const VARIANTS = {
  primary:
    "premium-btn-primary bg-[var(--accent-primary)] text-[var(--accent-on)] hover:bg-[var(--accent-hover)]",
  secondary:
    "premium-btn-secondary bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
  danger: "bg-[var(--error)] text-white hover:brightness-110",
}

const SIZES = {
  sm: "text-xs px-2.5 py-1.5 gap-1.5",
  md: "text-sm px-3.5 py-2 gap-2",
  lg: "text-base px-5 py-2.5 gap-2",
}

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-none font-bold uppercase tracking-wide transition-all duration-150",
        "disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" />}
      {children}
      {IconRight && <IconRight size={size === "sm" ? 14 : 16} aria-hidden="true" />}
    </button>
  )
}
