import { SkipBack, ChevronLeft, Play, Pause, ChevronRight, SkipForward } from "lucide-react"
import { useExplanationStore } from "../../stores/explanationStore.js"
import { ProgressBar } from "../shared/ProgressBar.jsx"
import { IconButton, Tooltip } from "../shared/IconButton.jsx"
import { cn } from "../../utils/cn.js"

const SPEEDS = [0.5, 1, 2, 4]

export function StepControls() {
  const currentStep = useExplanationStore((s) => s.currentStep)
  const isPlaying = useExplanationStore((s) => s.isPlaying)
  const speed = useExplanationStore((s) => s.playbackSpeed)
  const explanation = useExplanationStore((s) => s.explanation)
  const { reset, stepBackward, togglePlay, stepForward, toEnd, setSpeed } = useExplanationStore()

  const total = explanation.execution_steps.length

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-0.5">
          <Tooltip content="Reset (Home)">
            <IconButton icon={SkipBack} label="Reset to start" size={16} onClick={reset} />
          </Tooltip>
          <Tooltip content="Step back (←)">
            <IconButton icon={ChevronLeft} label="Step backward" size={18} onClick={stepBackward} />
          </Tooltip>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent-primary)] text-[var(--accent-on)] hover:bg-[var(--accent-hover)] transition-colors active:scale-95"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <Tooltip content="Step forward (→)">
            <IconButton icon={ChevronRight} label="Step forward" size={18} onClick={stepForward} />
          </Tooltip>
          <Tooltip content="Jump to end (End)">
            <IconButton icon={SkipForward} label="Jump to end" size={16} onClick={toEnd} />
          </Tooltip>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-tertiary)] p-0.5">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              aria-label={`Playback speed ${s}x`}
              aria-pressed={speed === s}
              className={cn(
                "px-2 py-1 text-[11px] font-medium rounded-md transition-colors",
                speed === s
                  ? "bg-[var(--accent-primary)] text-[var(--accent-on)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ProgressBar value={currentStep + 1} max={total} size="sm" />
        <span className="text-[11px] font-mono text-[var(--text-muted)] whitespace-nowrap">
          {currentStep + 1}/{total}
        </span>
      </div>
    </div>
  )
}
