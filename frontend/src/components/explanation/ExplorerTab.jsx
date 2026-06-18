import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown, ChevronRight, Folder, FolderOpen, Zap, Map, Network
} from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"

function TreeNode({ node, depth = 0, onSelect, activeKey }) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = node.children && node.children.length > 0
  const isActive = activeKey === node.key

  return (
    <div>
      <button
        className={
          "w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors rounded-lg " +
          (isActive
            ? "bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]")
        }
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => {
          if (hasChildren) setOpen(!open)
          onSelect(node.key, node.lineStart, node.lineEnd)
        }}
      >
        {/* Expand / leaf icon */}
        <span className="shrink-0 text-[var(--text-muted)]">
          {hasChildren ? (
            open ? <FolderOpen size={13} /> : <Folder size={13} />
          ) : (
            <Zap size={11} />
          )}
        </span>

        {/* Label */}
        <span className="flex-1 text-xs font-medium truncate">{node.label}</span>

        {/* Lines badge */}
        {node.lineStart != null && (
          <span className="shrink-0 text-[10px] font-mono text-[var(--text-muted)]">
            L{node.lineStart}
            {node.lineEnd && node.lineEnd !== node.lineStart ? `–${node.lineEnd}` : ""}
          </span>
        )}

        {hasChildren && (
          <span className="shrink-0 text-[var(--text-muted)]">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
        )}
      </button>

      <AnimatePresence>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            {node.children.map((child, i) => (
              <TreeNode
                key={child.key || i}
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
                activeKey={activeKey}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ExplorerTab() {
  const explanation = useExplanationStore((s) => s.explanation)
  const depth = useExplanationStore((s) => s.depth)
  const activeTreeNodeKey = useExplanationStore((s) => s.activeTreeNodeKey)
  const selectTreeNode = useExplanationStore((s) => s.selectTreeNode)
  const selectModule = useExplanationStore((s) => s.selectModule)

  const tree = explanation?.tree || []
  const modules = explanation?.modules || []
  const functions = explanation?.functions || []
  const summaryLayers = explanation?.summaryLayers

  if (tree.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">
        No structure detected.
      </div>
    )
  }

  const handleSelect = (key, lineStart, lineEnd) => {
    selectTreeNode(key, lineStart, lineEnd)
  }

  return (
    <div className="space-y-4">
      {/* High-level summary */}
      {summaryLayers && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Map size={14} style={{ color: "var(--accent-primary)" }} />
            <p className="text-xs font-semibold text-[var(--text-primary)]">System Overview</p>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
            {depth === "beginner"
              ? summaryLayers.layer1
              : depth === "intermediate"
              ? summaryLayers.layer2
              : summaryLayers.layer3}
          </p>
        </div>
      )}

      {/* Entry points / key modules strip */}
      {modules.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Key Entry Points
          </p>
          <div className="flex flex-wrap gap-2">
            {modules.slice(0, 8).map((mod, i) => (
              <button
                key={i}
                onClick={() => selectModule(i)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-medium bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                <span>{mod.icon}</span>
                <span className="max-w-[100px] truncate">{mod.name}</span>
                <span className="font-mono text-[var(--text-muted)] text-[10px]">
                  L{mod.lineStart}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible knowledge tree */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Network size={13} style={{ color: "var(--accent-primary)" }} />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Knowledge Tree
          </p>
          <span className="text-[10px] text-[var(--text-muted)]">
            — {functions.length} function{functions.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] py-2 overflow-hidden">
          {tree.map((node, i) => (
            <TreeNode
              key={node.key || i}
              node={node}
              depth={0}
              onSelect={handleSelect}
              activeKey={activeTreeNodeKey}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
