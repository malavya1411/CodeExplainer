import { useState } from "react"
import { Copy, Check, Link2 } from "lucide-react"
import { Modal } from "../shared/Modal.jsx"
import { Button } from "../shared/Button.jsx"
import { IconButton } from "../shared/IconButton.jsx"
import { toast } from "../shared/Toast.jsx"

export function ShareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  const [expires, setExpires] = useState("7")
  const url = typeof window !== "undefined" ? window.location.href : "https://codeexplainer.app/share/abcxyz"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Explanation"
      width="max-w-md"
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      <div className="space-y-5">
        <p className="text-sm text-[var(--text-secondary)]">
          Anyone with this link can view this code explanation interactively.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            Link Expiration
          </label>
          <select
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
            className="w-full appearance-none text-sm bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded p-2 border border-[var(--border)] cursor-pointer"
          >
            <option value="1">1 hour</option>
            <option value="24">1 day</option>
            <option value="7">7 days</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            Share Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
            <div className="flex items-center justify-center w-8 shrink-0 text-[var(--text-muted)]">
              <Link2 size={16} />
            </div>
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-[var(--text-primary)] min-w-0"
              onFocus={(e) => e.target.select()}
            />
            <Button
              variant={copied ? "primary" : "secondary"}
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
