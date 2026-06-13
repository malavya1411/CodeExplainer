import { useState, useRef } from "react"
import { cn } from "../../utils/cn.js"

export function IconButton({ icon: Icon, label, size = 18, className, active, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded p-2 min-w-[36px] min-h-[36px] transition-all duration-150",
        "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:scale-95",
        active && "bg-[var(--bg-tertiary)] text-[var(--accent-primary)]",
        className,
      )}
      {...props}
    >
      <Icon size={size} aria-hidden="true" />
    </button>
  )
}

export function Tooltip({ content, position = "top", children }) {
  const [show, setShow] = useState(false)
  const ref = useRef(null)
  const pos = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }
  return (
    <span
      className="relative inline-flex"
      ref={ref}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && content && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none animate-fade-in",
            "bg-[var(--text-primary)] text-[var(--bg-secondary)] shadow-lg max-w-[260px]",
            pos[position],
          )}
        >
          {content}
        </span>
      )}
    </span>
  )
}
