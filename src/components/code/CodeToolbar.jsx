import { useRef } from "react"
import { Upload, Trash2, Copy, AlignLeft, ChevronDown, Link2, Highlighter } from "lucide-react"
import { useCodeStore } from "../../stores/codeStore.js"
import { SUPPORTED_LANGUAGES } from "../../utils/languageDetector.js"
import { IconButton, Tooltip } from "../shared/IconButton.jsx"
import { toast } from "../shared/Toast.jsx"

export function CodeToolbar({ onFormat, onHighlightExplain }) {
  const code = useCodeStore((s) => s.code)
  const language = useCodeStore((s) => s.language)
  const setLanguage = useCodeStore((s) => s.setLanguage)
  const clearCode = useCodeStore((s) => s.clearCode)
  const loadFile = useCodeStore((s) => s.loadFile)
  const loadFromUrl = useCodeStore((s) => s.loadFromUrl)
  const fileRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const ok = await loadFile(file)
      if (ok) toast.success(`Loaded ${file.name}`)
      else toast.error(useCodeStore.getState().analysisError || "Could not load file")
    }
    e.target.value = ""
  }

  const handleUrl = async () => {
    const url = window.prompt("Paste a GitHub file URL or raw code URL:")
    if (!url) return
    const ok = await loadFromUrl(url)
    if (ok) toast.success("Fetched code from URL")
    else toast.error("Could not fetch from URL")
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success("Code copied to clipboard")
    } catch {
      toast.error("Could not copy code")
    }
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="relative">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Select language"
          className="appearance-none text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded pl-2.5 pr-7 py-1.5 border border-[var(--border)] cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]"
        />
      </div>

      <div className="w-px h-5 bg-[var(--border)] mx-0.5" />

      <input
        ref={fileRef}
        type="file"
        accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.cc,.go,.rs,.cs,.rb,.php"
        className="hidden"
        onChange={handleFile}
      />
      <Tooltip content="Upload file">
        <IconButton icon={Upload} label="Upload file" size={16} onClick={() => fileRef.current?.click()} />
      </Tooltip>
      <Tooltip content="Import from URL">
        <IconButton icon={Link2} label="Import from URL" size={16} onClick={handleUrl} />
      </Tooltip>
      <Tooltip content="Highlight & explain">
        <IconButton icon={Highlighter} label="Highlight and explain selection" size={16} onClick={onHighlightExplain} />
      </Tooltip>

      <div className="flex-1" />

      <Tooltip content="Format code">
        <IconButton icon={AlignLeft} label="Format code" size={16} onClick={onFormat} />
      </Tooltip>
      <Tooltip content="Copy code">
        <IconButton icon={Copy} label="Copy code" size={16} onClick={handleCopy} />
      </Tooltip>
      <Tooltip content="Clear">
        <IconButton icon={Trash2} label="Clear code" size={16} onClick={clearCode} />
      </Tooltip>
    </div>
  )
}
