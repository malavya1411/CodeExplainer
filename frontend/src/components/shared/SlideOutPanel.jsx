import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../utils/cn.js"

export function SlideOutPanel({ direction = "left", isOpen, onClose, title, children, width = "320px" }) {
  const fromLeft = direction === "left"
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="absolute inset-0 z-30 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-label={title}
            className={cn(
              "absolute top-0 bottom-0 z-40 bg-[var(--bg-secondary)] border-[var(--border)] shadow-xl flex flex-col",
              fromLeft ? "left-0 border-r" : "right-0 border-l",
            )}
            style={{ width }}
            initial={{ x: fromLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: fromLeft ? "-100%" : "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
              <button
                onClick={onClose}
                aria-label="Close panel"
                className="rounded p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
