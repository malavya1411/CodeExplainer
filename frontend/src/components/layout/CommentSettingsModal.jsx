import { X, Check } from "lucide-react"
import { useCommentStore } from "../../stores/commentStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { toast } from "../shared/Toast.jsx"

export function CommentSettingsModal({ isOpen, onClose, activeWorkspace, onWorkspaceChange }) {
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)

  const commentSettings = useCommentStore((s) => s.commentSettings)
  const updateSettings = useCommentStore((s) => s.updateSettings)
  const resetSettings = useCommentStore((s) => s.resetSettings)
  const generateComments = useCommentStore((s) => s.generateComments)

  if (!isOpen) return null

  const handleDepthChange = (depth) => {
    updateSettings({ depth })
    useExplanationStore.getState().setDepth(depth)
    const comments = useCommentStore.getState().commentedCodes
    if (comments && comments[depth]) {
      useCommentStore.setState({ commentedCode: comments[depth] })
    }
  }

  const handlePlacementToggle = (key) => {
    updateSettings({
      placement: {
        ...commentSettings.placement,
        [key]: !commentSettings.placement[key]
      }
    })
  }

  const handleStyleToggle = (key) => {
    updateSettings({
      style: {
        ...commentSettings.style,
        [key]: !commentSettings.style[key]
      }
    })
  }

  const handleFormattingToggle = (key) => {
    updateSettings({
      formatting: {
        ...commentSettings.formatting,
        [key]: !commentSettings.formatting[key]
      }
    })
  }

  const handleMaxLengthChange = (val) => {
    const num = parseInt(val, 10) || 80
    updateSettings({
      formatting: {
        ...commentSettings.formatting,
        maxLength: num
      }
    })
  }

  const handleApply = () => {
    generateComments(code, language)
    useExplanationStore.getState().setActiveTab("Comments")
    if (activeWorkspace !== "explainer" && onWorkspaceChange) {
      onWorkspaceChange("explainer")
    }
    toast.success("Settings applied and comments updated!")
    onClose()
  }

  const handleReset = () => {
    resetSettings()
    toast.info("Restored factory defaults.")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--bg-secondary)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col h-full animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] select-none">
          <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">Comment Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[var(--text-secondary)] select-none">
          
          {/* Depth Selection */}
          <div className="space-y-2">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Comment Depth</h3>
            <div className="flex bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl p-1 shadow-sm">
              {["beginner", "intermediate", "expert"].map((d) => {
                const isActive = commentSettings.depth === d
                return (
                  <button
                    key={d}
                    onClick={() => handleDepthChange(d)}
                    className={`flex-1 text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm"
                        : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Placement Options */}
          <div className="space-y-3">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Comment Placement</h3>
            <div className="space-y-2.5">
              <ToggleCheckbox
                label="Docstrings for functions & classes"
                checked={commentSettings.placement.docstrings}
                onChange={() => handlePlacementToggle("docstrings")}
              />
              <ToggleCheckbox
                label="Inline comments for complex lines"
                checked={commentSettings.placement.inlineComplex}
                onChange={() => handlePlacementToggle("inlineComplex")}
              />
              <ToggleCheckbox
                label="Block comments above control structures"
                checked={commentSettings.placement.blockAboveControl}
                onChange={() => handlePlacementToggle("blockAboveControl")}
              />
              <ToggleCheckbox
                label="Comments for simple variable declarations"
                checked={commentSettings.placement.simpleVariables}
                onChange={() => handlePlacementToggle("simpleVariables")}
              />
              <ToggleCheckbox
                label="Complexity notes (Big-O) in docstrings"
                checked={commentSettings.placement.complexityNotes}
                onChange={() => handlePlacementToggle("complexityNotes")}
              />
            </div>
          </div>

          {/* Style Customization */}
          <div className="space-y-3">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Comment Style</h3>
            <div className="space-y-2.5">
              <ToggleCheckbox
                label="Use analogies in Beginner mode"
                checked={commentSettings.style.useAnalogies}
                onChange={() => handleStyleToggle("useAnalogies")}
              />
              <ToggleCheckbox
                label="Include parameter types in docstrings"
                checked={commentSettings.style.includeTypes}
                onChange={() => handleStyleToggle("includeTypes")}
              />
              <ToggleCheckbox
                label="Include author/timestamp in docstrings"
                checked={commentSettings.style.includeAuthor}
                onChange={() => handleStyleToggle("includeAuthor")}
              />
              <ToggleCheckbox
                label="Note edge cases in comments"
                checked={commentSettings.style.noteEdgeCases}
                onChange={() => handleStyleToggle("noteEdgeCases")}
              />
              <ToggleCheckbox
                label="Suggest alternatives in Expert mode"
                checked={commentSettings.style.suggestAlternatives}
                onChange={() => handleStyleToggle("suggestAlternatives")}
              />
            </div>
          </div>

          {/* Formatting Rules */}
          <div className="space-y-3">
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Formatting</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Max comment length (characters)</span>
                <input
                  type="number"
                  min="40"
                  max="160"
                  value={commentSettings.formatting.maxLength}
                  onChange={(e) => handleMaxLengthChange(e.target.value)}
                  className="w-16 rounded border border-[var(--border)] bg-[var(--bg-primary)] px-2 py-1 text-[var(--text-primary)] font-bold text-center"
                />
              </div>
              <ToggleCheckbox
                label="Add blank lines between code sections"
                checked={commentSettings.formatting.blankLinesBetweenSections}
                onChange={() => handleFormattingToggle("blankLinesBetweenSections")}
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-between shrink-0">
          <button
            onClick={handleReset}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 text-xs font-bold rounded-lg px-4 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--accent-on)] transition-colors cursor-pointer shadow-sm active:scale-95"
          >
            <Check size={13} strokeWidth={2.5} />
            Apply Changes
          </button>
        </div>

      </div>
    </>
  )
}

function ToggleCheckbox({ label, checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className="flex items-center gap-2 w-full text-left font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
    >
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
        checked
          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-on)]"
          : "border-[var(--border)] bg-transparent"
      }`}>
        {checked && <Check size={10} strokeWidth={3} />}
      </div>
      <span>{label}</span>
    </button>
  )
}
