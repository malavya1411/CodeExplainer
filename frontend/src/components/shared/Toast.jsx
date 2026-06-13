import { create } from "zustand"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react"

let idCounter = 0

export const useToastStore = create((set, get) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 4000) => {
    const id = ++idCounter
    set({ toasts: [...get().toasts, { id, message, type }] })
    if (duration) {
      setTimeout(() => get().removeToast(id), duration)
    }
    return id
  },
  removeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = {
  success: (m) => useToastStore.getState().addToast(m, "success"),
  error: (m) => useToastStore.getState().addToast(m, "error", 5000),
  warning: (m) => useToastStore.getState().addToast(m, "warning"),
  info: (m) => useToastStore.getState().addToast(m, "info"),
}

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS = {
  success: "var(--success)",
  error: "var(--error)",
  warning: "var(--warning)",
  info: "var(--info)",
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)
  return (
    <div
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[320px] max-w-[calc(100vw-2rem)]"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] p-3 shadow-lg"
            >
              <Icon size={18} style={{ color: COLORS[t.type], flexShrink: 0, marginTop: 1 }} />
              <p className="flex-1 text-sm text-[var(--text-primary)]">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                aria-label="Dismiss notification"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
