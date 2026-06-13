import { Sun, Moon, Code2, Check, Loader2, ArrowRight } from "lucide-react"
import { useAuthStore } from "../../stores/authStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { Button } from "../shared/Button.jsx"
import { toast } from "../shared/Toast.jsx"

export function AuthPage() {
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <div className="flex h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 relative overflow-hidden">
      
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

      {/* Main Container Split View */}
      <div className="flex flex-1 w-full h-full">
        
        {/* Left Side: Features & Code Preview (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col w-1/2 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-12 justify-between select-none relative overflow-hidden">
          
          {/* Logo & Header */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-primary)] text-[var(--accent-on)] shadow-md">
              <Code2 size={22} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">CodeExplainer</span>
              <span className="block text-xs text-[var(--text-muted)] font-medium leading-none">Swiss-Developer Tools</span>
            </div>
          </div>

          {/* Core Feature Text Blocks */}
          <div className="my-auto max-w-lg space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
                Understand Code, Visually.
              </h1>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Transform complex code snippets into interactive line-by-line debugger walkthroughs, runtime execution flows, complexity reports, and visual diagrams.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <FeatureItem label="Interactive Code Walkthroughs" />
              <FeatureItem label="Complexity Analysis" />
              <FeatureItem label="Visual Execution Flow" />
              <FeatureItem label="Multi-Level Explanations" />
            </div>
          </div>

          {/* Clean Mock Code Editor Illustration */}
          <div className="w-full premium-card p-4 relative font-mono text-[11px] leading-relaxed max-w-lg mx-auto bg-[var(--bg-primary)]">
            <div className="flex items-center gap-1.5 pb-3 border-b border-[var(--border)] mb-3 text-[var(--text-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-60"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-60"></span>
              <span className="ml-2 text-[10px] select-none">solution.java</span>
            </div>
            <div className="space-y-1 select-none">
              <div><span className="text-[var(--syntax-keyword)]">class</span> <span className="text-[var(--text-primary)]">Solution</span> &#123;</div>
              <div className="pl-4"><span className="text-[var(--syntax-keyword)]">public int</span> <span className="text-[var(--syntax-function)]">search</span>(<span className="text-[var(--syntax-keyword)]">int</span>[] nums, <span className="text-[var(--syntax-keyword)]">int</span> target) &#123;</div>
              <div className="pl-8"><span className="text-[var(--syntax-keyword)]">if</span> (nums.length == <span className="text-[var(--syntax-number)]">0</span>) <span className="text-[var(--syntax-keyword)]">return</span> -<span className="text-[var(--syntax-number)]">1</span>;</div>
              <div className="pl-8"><span className="text-[var(--syntax-keyword)]">for</span> (<span className="text-[var(--syntax-keyword)]">int</span> i = <span className="text-[var(--syntax-number)]">0</span>; i &lt; nums.length; i++) &#123;</div>
              <div className="pl-12 bg-[color-mix(in_srgb,var(--accent-primary)_12%,transparent)] border-l-2 border-[var(--accent-primary)] -ml-0.5 pl-[10px]"><span className="text-[var(--syntax-keyword)]">if</span> (nums[i] == target) <span className="text-[var(--syntax-keyword)]">return</span> i;</div>
              <div className="pl-8">&#125;</div>
              <div className="pl-8"><span className="text-[var(--syntax-keyword)]">return</span> -<span className="text-[var(--syntax-number)]">1</span>;</div>
              <div className="pl-4">&#125;</div>
              <div>&#125;</div>
            </div>
          </div>
        </div>

        {/* Right Side: Welcome/Launcher Panel */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[var(--bg-primary)] relative">
          
          {/* Logo only visible on mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8 select-none">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-[var(--accent-primary)] text-[var(--accent-on)]">
              <Code2 size={18} />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)]">CodeExplainer</span>
          </div>

          {/* Welcome Sandbox Launcher Card */}
          <div className="w-full max-w-[420px] premium-card p-8 space-y-6 animate-fade-in relative text-center">
            
            {/* Loading Cover Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[var(--bg-secondary)]/85 backdrop-blur-[1px] rounded-xl select-none">
                <Loader2 size={28} className="animate-spin text-[var(--accent-primary)]" />
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  Launching Sandbox...
                </p>
              </div>
            )}

            {/* Open Source Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--accent-primary)_20%,transparent)] text-[var(--accent-primary)] mx-auto select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
              Open Source Sandbox
            </div>

            {/* Header Text */}
            <div className="space-y-2 select-none">
              <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                Launch Workspace
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                CodeExplainer is fully open-source and free to use. Explore visual execution timelines, code complexity structures, and comment generators instantly without an account.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={isLoading}
                onClick={async () => {
                  try {
                    await login("developer@codeexplainer.org", "guestpass123")
                    toast.success("Welcome to the sandbox!")
                  } catch (err) {
                    toast.error("Failed to launch sandbox.")
                  }
                }}
                className="w-full justify-center gap-2 group cursor-pointer shadow-md py-3 text-sm font-bold"
              >
                <span>Enter Sandbox</span>
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>

            {/* Telemetry/Disclaimers */}
            <p className="text-[10px] text-[var(--text-muted)] leading-normal select-none">
              All settings and preferences are saved locally in your browser storage. Zero tracking scripts or analytics are active.
            </p>
          </div>

          {/* Footer links */}
          <div className="absolute bottom-6 flex gap-3.5 text-[10px] text-[var(--text-muted)] select-none">
            <a href="#" className="hover:text-[var(--text-primary)] hover:underline">Terms of Service</a>
            <span className="w-px h-3 bg-[var(--border)]"></span>
            <a href="#" className="hover:text-[var(--text-primary)] hover:underline">Privacy Policy</a>
          </div>

        </div>

      </div>

    </div>
  )
}

function FeatureItem({ label }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] font-medium">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)]">
        <Check size={12} strokeWidth={3} />
      </div>
      <span>{label}</span>
    </div>
  )
}
