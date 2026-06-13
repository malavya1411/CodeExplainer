import { BookOpen, ListOrdered, Variable, Gauge, GitBranch, FileText } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { cn } from "../../utils/cn.js"

const TABS = [
  { id: "Overview", icon: BookOpen },
  { id: "Step-by-Step", icon: ListOrdered },
  { id: "Variables", icon: Variable },
  { id: "Complexity", icon: Gauge },
  { id: "Diagrams", icon: GitBranch },
  { id: "Comments", icon: FileText },
]

export function TabNavigation() {
  const activeTab = useExplanationStore((s) => s.activeTab)
  const setActiveTab = useExplanationStore((s) => s.setActiveTab)

  return (
    <div
      role="tablist"
      aria-label="Explanation views"
      className="flex items-center gap-0.5 px-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] overflow-x-auto shrink-0"
    >
      {TABS.map((t) => {
        const active = activeTab === t.id
        const Icon = t.icon
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors",
              active
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{t.id}</span>
            {active && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--accent-primary)]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
