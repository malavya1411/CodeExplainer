import { useThemeStore, useA11yStore } from "../../stores/themeStore.js"
import { Modal } from "../shared/Modal.jsx"
import { Button } from "../shared/Button.jsx"

export function SettingsModal({ isOpen, onClose }) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const dyslexiaFont = useA11yStore((s) => s.dyslexiaFont)
  const setDyslexiaFont = useA11yStore((s) => s.setDyslexiaFont)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      width="max-w-md"
      footer={<Button variant="primary" onClick={onClose}>Done</Button>}
    >
      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Appearance</h3>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "light"}
                onChange={() => setTheme("light")}
                className="accent-[var(--accent-primary)]"
              />
              Light Mode
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "dark"}
                onChange={() => setTheme("dark")}
                className="accent-[var(--accent-primary)]"
              />
              Dark Mode
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                checked={theme === "system"}
                onChange={() => setTheme("system")}
                className="accent-[var(--accent-primary)]"
              />
              System Preference
            </label>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Accessibility</h3>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dyslexiaFont}
                onChange={(e) => setDyslexiaFont(e.target.checked)}
                className="accent-[var(--accent-primary)] rounded border-[var(--border)]"
              />
              Dyslexia-friendly Font
            </label>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Changes the main font to be more readable for users with dyslexia.
            </p>
          </div>
        </section>
      </div>
    </Modal>
  )
}
