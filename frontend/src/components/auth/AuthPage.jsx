import { Sun, Moon, Code2, Check, Loader2, ArrowRight, Zap, RefreshCw, MessageSquare, Network, Activity, BookOpen, Terminal } from "lucide-react"
import { useAuthStore } from "../../stores/authStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { Button } from "../shared/Button.jsx"
import { toast } from "../shared/Toast.jsx"

export function AuthPage({ onLaunch }) {
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const handleLaunch = async (workspace, tab = null) => {
    try {
      await login("developer@codeexplainer.org", "guestpass123")
      toast.success("Welcome to the workspace!")
      if (onLaunch) {
        onLaunch(workspace, tab)
      }
    } catch (err) {
      toast.error("Failed to launch workspace.")
    }
  }

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
        
        {/* Left Side: Features & Value Proposition (Hidden on Mobile) */}
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
          <div className="my-auto max-w-lg space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] leading-[1.15]">
                Understand Code.<br/>
                <span className="text-[var(--accent-primary)]">Optimize It.</span><br/>
                Convert It.<br/>
                Document It.
              </h1>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
                AI-powered developer workspace that helps you explain, improve, convert, and document code.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <FeatureItem label="Multi-level explanations" />
              <FeatureItem label="Code optimization" />
              <FeatureItem label="Language conversion" />
              <FeatureItem label="Smart comments" />
              <FeatureItem label="Architecture insights" />
              <FeatureItem label="Interactive walkthroughs" />
            </div>

            {/* Visual Feature Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <FeatureGridCard icon={BookOpen} title="Explain" desc="Line-by-line breakdown" />
              <FeatureGridCard icon={Zap} title="Optimize" desc="Performance tuning" />
              <FeatureGridCard icon={RefreshCw} title="Convert" desc="Language translation" />
              <FeatureGridCard icon={MessageSquare} title="Comments" desc="Auto-documentation" />
              <FeatureGridCard icon={Network} title="Diagrams" desc="Architecture flows" />
              <FeatureGridCard icon={Activity} title="Complexity" desc="Big-O Analysis" />
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
          <div className="w-full max-w-[420px] space-y-8 animate-fade-in relative">
            
            <div className="premium-card p-8 space-y-6 relative text-center">
              {/* Loading Cover Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[var(--bg-secondary)]/85 backdrop-blur-[1px] rounded-xl select-none">
                  <Loader2 size={28} className="animate-spin text-[var(--accent-primary)]" />
                  <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    Launching Workspace...
                  </p>
                </div>
              )}

              {/* Header Text */}
              <div className="space-y-2 select-none">
                <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
                  Get Started
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Join the workspace. CodeExplainer is fully open-source and free to use. Explore visual execution timelines, code complexity structures, and comment generators instantly.
                </p>
              </div>

              {/* Workspace Launchers */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={isLoading}
                    onClick={() => handleLaunch("explainer", "Overview")}
                    className="w-full justify-center gap-2 group cursor-pointer shadow-sm text-xs font-bold py-2.5"
                  >
                    <BookOpen size={14} className="text-[var(--accent-on)]" />
                    <span>Explain Code</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() => handleLaunch("optimizer")}
                    className="w-full justify-center gap-2 group cursor-pointer shadow-sm text-xs font-bold py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] border border-[var(--border)]"
                  >
                    <Zap size={14} className="text-[var(--accent-primary)]" />
                    <span>Optimize Code</span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() => handleLaunch("converter")}
                    className="w-full justify-center gap-2 group cursor-pointer shadow-sm text-xs font-bold py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] border border-[var(--border)]"
                  >
                    <RefreshCw size={14} className="text-[var(--accent-primary)]" />
                    <span>Convert Code</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isLoading}
                    onClick={() => handleLaunch("explainer", "Comments")}
                    className="w-full justify-center gap-2 group cursor-pointer shadow-sm text-xs font-bold py-2.5 bg-[var(--bg-tertiary)] hover:bg-[var(--border)] border border-[var(--border)]"
                  >
                    <MessageSquare size={14} className="text-[var(--accent-primary)]" />
                    <span>Generate Comments</span>
                  </Button>
                </div>
              </div>

              {/* Telemetry/Disclaimers */}
              <p className="text-[10px] text-[var(--text-muted)] leading-normal select-none">
                All settings and preferences are saved locally in your browser storage. Zero tracking scripts or analytics are active.
              </p>
            </div>

            {/* Developer Stats / Mock visual panel */}
            <div className="premium-card p-4 flex items-center justify-between text-[var(--text-secondary)] bg-[var(--bg-secondary)] text-xs select-none shadow-sm">
               <div className="flex items-center gap-2">
                 <Terminal size={14} className="text-[var(--accent-primary)]" />
                 <span className="font-mono">system.status</span>
               </div>
               <div className="flex items-center gap-4 font-mono">
                 <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"></span>
                   API Ready
                 </div>
                 <div className="text-[var(--text-muted)]">v1.2.0</div>
               </div>
            </div>

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
      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)] shrink-0">
        <Check size={10} strokeWidth={3} />
      </div>
      <span>{label}</span>
    </div>
  )
}

function FeatureGridCard({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent-primary)] hover:shadow-sm transition-all group">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[color-mix(in_srgb,var(--accent-primary)_10%,transparent)] text-[var(--accent-primary)] shrink-0 group-hover:scale-105 transition-transform">
        <Icon size={16} />
      </div>
      <div className="space-y-0.5">
        <div className="text-xs font-bold text-[var(--text-primary)]">{title}</div>
        <div className="text-[10px] text-[var(--text-muted)] leading-tight">{desc}</div>
      </div>
    </div>
  )
}
