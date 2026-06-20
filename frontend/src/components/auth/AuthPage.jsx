import { Sun, Moon } from "lucide-react"
import { useThemeStore } from "../../stores/themeStore.js"
import { HeroSection } from "../ui/3d-hero-section-boxes"

export function AuthPage() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <div className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden">
      {/* Theme Toggler (Top-Right) */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <HeroSection />
    </div>
  )
}
