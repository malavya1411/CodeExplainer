import { useState, useRef, useEffect } from "react"
import { 
  Sun, Moon, Code2, Check, Loader2, ArrowRight, Zap, RefreshCw, 
  MessageSquare, Network, Activity, BookOpen, Terminal, Sparkles, 
  Rocket, FolderOpen, Globe, Shield, ChevronDown, Monitor, Star, Layers 
} from "lucide-react"
import { useAuthStore } from "../../stores/authStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { useCodeStore } from "../../stores/codeStore.js"
import { Button } from "../shared/Button.jsx"
import { toast } from "../shared/Toast.jsx"

export function AuthPage({ onLaunch }) {
  const login = useAuthStore((s) => s.login)
  const isLoading = useAuthStore((s) => s.isLoading)
  const loadFile = useCodeStore((s) => s.loadFile)
  const fileRef = useRef(null)

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

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const ok = await loadFile(file)
      if (ok) {
        toast.success(`Loaded ${file.name}`)
        handleLaunch("explainer", "Overview")
      } else {
        toast.error(useCodeStore.getState().analysisError || "Could not load file")
      }
    }
    e.target.value = ""
  }

  // Syntax highlighted lines for JS editor snippet
  const CODE_LINES = [
    <div key="1" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">1</span><span><span className="text-[#e2895b]">function</span> <span className="text-[#8cd693]">search</span>(nums, target) {"{"}</span></div>,
    <div key="2" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">2</span><span>  <span className="text-[#e2895b]">let</span> left = <span className="text-[#dfbe7a]">0</span>;</span></div>,
    <div key="3" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">3</span><span>  <span className="text-[#e2895b]">let</span> right = nums.length - <span className="text-[#dfbe7a]">1</span>;</span></div>,
    <div key="4" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">4</span><span>  <span className="text-[#e2895b]">while</span> (left &lt;= right) {"{"}</span></div>,
    <div key="5" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">5</span><span>    <span className="text-[#e2895b]">const</span> mid = Math.floor((left + right) / <span className="text-[#dfbe7a]">2</span>);</span></div>,
    <div key="6" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">6</span><span>    <span className="text-[#e2895b]">if</span> (nums[mid] === target) {"{"}</span></div>,
    <div key="7" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">7</span><span>      <span className="text-[#e2895b]">return</span> mid;</span></div>,
    <div key="8" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">8</span><span>    {"}"}</span></div>,
    <div key="9" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">9</span><span>    left = mid + <span className="text-[#dfbe7a]">1</span>;</span></div>,
    <div key="10" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">10</span><span>  {"}"}</span></div>,
    <div key="11" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">11</span><span>  <span className="text-[#e2895b]">return</span> -<span className="text-[#dfbe7a]">1</span>;</span></div>,
    <div key="12" className="flex"><span className="w-6 text-gray-600 text-right select-none pr-3 text-[10px]">12</span><span>{"}"}</span></div>
  ]

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#070908] text-[#F5F4EE] flex flex-col justify-between relative">
      
      {/* Hidden File Input */}
      <input 
        ref={fileRef}
        type="file" 
        onChange={handleFileChange}
        accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.cc,.go,.rs,.cs,.rb,.php"
        className="hidden" 
      />

      {/* Header section */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 lg:py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1c3024] text-[#4ede7d] border border-[#2e5a3c]">
            <Code2 size={22} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">CodeExplainer</span>
            <span className="block text-[10px] text-gray-500 font-medium leading-none mt-0.5">Swiss-Developer Tools</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSelector />
        </div>
      </header>

      {/* Loading Cover Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#070908]/90 backdrop-blur-sm select-none">
          <Loader2 size={36} className="animate-spin text-[#4ede7d]" />
          <p className="text-sm font-semibold text-gray-300">
            Launching Workspace...
          </p>
        </div>
      )}

      {/* Main split content section */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-6 py-4 lg:py-2 flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Left Side: Product Description, Bullets and Code mockup */}
        <div className="lg:col-span-7 flex flex-col space-y-4 text-left min-h-0">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold select-none w-fit">
            <Star size={10} className="fill-current text-emerald-400" />
            <span>AI-Powered Code Intelligence</span>
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-[45px] font-extrabold tracking-tight leading-[1.1] text-white">
            One Workspace. <br />
            Four <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500">Developer Superpowers.</span>
          </h1>

          <p className="text-xs lg:text-sm text-gray-400 leading-relaxed max-w-xl">
            Explain, optimize, convert, and document code with AI-powered analysis built for students, developers, and engineering teams.
          </p>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-1">
            <FeatureItem label="Multi-level explanations" />
            <FeatureItem label="Code optimization" />
            <FeatureItem label="Language conversion" />
            <FeatureItem label="Smart comment generation" />
            <FeatureItem label="Architecture & dependency insights" />
            <FeatureItem label="Interactive execution walkthroughs" />
          </div>

          {/* High Fidelity Code and Badge Mockup */}
          <div className="relative bg-[#0a0c0b]/70 border border-[#1b1f1c] rounded-2xl p-4 shadow-2xl flex flex-col md:grid md:grid-cols-12 gap-4 items-center w-full">
            {/* Editor visual block */}
            <div className="w-full md:col-span-7 flex flex-col bg-[#060807] border border-[#171a18] rounded-xl overflow-hidden shadow-inner">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#171a18] bg-[#0c0e0d]">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-[#f7df1e] text-black font-extrabold text-[10px] rounded flex items-center justify-center font-sans select-none">JS</span>
                  <span className="font-mono text-[10px] text-gray-400 select-none">example.js</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#27c93f]"></span>
                </div>
              </div>
              <div className="p-3 font-mono text-[11px] text-gray-300 leading-relaxed overflow-x-auto select-none space-y-0.5">
                {CODE_LINES}
              </div>
            </div>

            {/* Badges block */}
            <div className="w-full md:col-span-5 flex flex-col gap-2.5 relative">
              {/* Star sparkles illustration */}
              <div className="absolute -top-6 -right-2 text-emerald-400/40 animate-pulse pointer-events-none">
                <Sparkles size={40} />
              </div>
              {/* Dotted curve decorator line */}
              <svg className="absolute -left-6 bottom-4 w-8 h-16 text-emerald-500/10 pointer-events-none hidden md:block" fill="none" viewBox="0 0 32 64">
                <path d="M0 64 C 16 64, 32 48, 32 32 C 32 16, 16 0, 0 0" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
              </svg>

              <FloatingBadge 
                icon={BookOpen} 
                title="Explanation Generated" 
                colorClass="border-emerald-500/20 bg-[#0c0f0d] text-emerald-400"
                iconColor="text-emerald-400"
              />
              <FloatingBadge 
                icon={Activity} 
                title="Complexity: O(log n)" 
                colorClass="border-emerald-500/20 bg-[#0c0f0d] text-emerald-400"
                iconColor="text-emerald-400"
              />
              <FloatingBadge 
                customIcon={
                  <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.93 1.01c-1.44 0-2.76.11-3.72.31-2.22.45-2.61 1.4-2.61 3.5v2.22H9.2v.62H4.44C2.34 7.66 2 8.44 2 10.74v3.52c0 2.22.42 2.76 2.44 2.76h1.16v-1.62c0-2.44 2-4.44 4.44-4.44h4.44c1.44 0 2.61-1.18 2.61-2.62v-3.5c0-2.22-.52-2.92-2.61-3.5-1.1-.3-2.66-.45-4.59-.45v.02zM8.33 3.66a.93.93 0 1 1 0 1.86.93.93 0 0 1 0-1.86zm6.34 5.6c0 2.44-2 4.44-4.44 4.44H5.79c-1.44 0-2.61 1.18-2.61 2.62v3.5c0 2.22.52 2.92 2.61 3.5 1.7.46 3.99.67 6.28.67s4.58-.2 6.28-.67c2.09-.58 2.61-1.28 2.61-3.5v-2.22h-3.59v-.62h4.76c2.1 0 2.44-.78 2.44-3.08v-3.52c0-2.22-.42-2.76-2.44-2.76h-1.16v1.62c-.01.01-.01.01-.01.02zM15.4 18.25a.93.93 0 1 1 0 1.86.93.93 0 0 1 0-1.86z"/>
                  </svg>
                }
                title="Python Version" 
                subtitle="Ready to view" 
                colorClass="border-blue-500/20 bg-[#0b0e12] text-[#4f85e4]"
                iconColor="text-blue-400"
              />
              <FloatingBadge 
                icon={MessageSquare} 
                title="Comments Added" 
                subtitle="Auto-generated docs" 
                colorClass="border-amber-500/20 bg-[#120f0b] text-amber-400"
                iconColor="text-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Welcome / Interactive Launcher Grid */}
        <div className="lg:col-span-5 w-full flex flex-col items-center min-h-0">
          <div className="w-full max-w-[440px] bg-[#0c0e0d] border border-[#1b1f1c] rounded-[24px] p-5 lg:p-6 space-y-4 shadow-2xl relative">
            <div className="space-y-1 text-left">
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Start Building</h2>
              <p className="text-xs text-gray-400 leading-relaxed">Choose where you want to begin</p>
            </div>

            {/* Grid of Launcher Cards */}
            <div className="grid grid-cols-2 gap-3">
              <LauncherCard 
                icon={BookOpen}
                title="Explain Code"
                desc="Understand any code with AI-powered explanations at multiple levels."
                colorTheme="green"
                onClick={() => handleLaunch("explainer", "Overview")}
              />
              <LauncherCard 
                icon={Zap}
                title="Optimize Code"
                desc="Improve performance, readability, and security with smart suggestions."
                colorTheme="purple"
                onClick={() => handleLaunch("optimizer")}
              />
              <LauncherCard 
                icon={RefreshCw}
                title="Convert Code"
                desc="Translate code between 10+ programming languages instantly."
                colorTheme="blue"
                onClick={() => handleLaunch("converter")}
              />
              <LauncherCard 
                icon={MessageSquare}
                title="Add Comments"
                desc="Generate clear, concise, and meaningful comments automatically."
                colorTheme="orange"
                onClick={() => handleLaunch("explainer", "Comments")}
              />
            </div>

            {/* Launch Workspace Main CTA */}
            <button
              onClick={() => handleLaunch("explainer", "Overview")}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <Rocket size={14} />
              <span>Launch Workspace</span>
            </button>

            {/* Open Local File button */}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-2 border border-[#1e2220] hover:border-gray-700 bg-transparent hover:bg-white/5 rounded-xl flex flex-col items-center justify-center gap-0.5 active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <FolderOpen size={12} className="text-emerald-400" />
                <span>Open Local File</span>
              </div>
              <span className="text-[9px] text-gray-500 leading-none">Work with your existing code</span>
            </button>
          </div>
        </div>

      </main>

      {/* Bottom stats row container */}
      <footer className="w-full max-w-7xl mx-auto px-6 mt-3 lg:mt-1 pb-4 z-10 flex flex-col items-center">
        
        {/* Stats card */}
        <div className="w-full bg-[#0a0c0b]/80 border border-[#171a18] rounded-2xl p-4 lg:p-3 shadow-lg select-none mb-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-0 md:divide-x md:divide-[#171a18]">
            <StatItem icon={Code2} value="50K+" label="Lines Supported" />
            <StatItem icon={Globe} value="10+" label="Languages" />
            <StatItem icon={Layers} value="3" label="Explanation Levels" />
            <StatItem icon={Shield} value="100%" label="Local & Private" />
            <StatItem icon={Sparkles} value="AI" label="Powered Analysis" />
          </div>
        </div>

        {/* Footer legal links and text */}
        <div className="flex flex-col items-center space-y-1 select-none text-[10px] text-gray-500">
          <p>Trusted by developers and students worldwide</p>
          <div className="flex items-center gap-2.5">
            <a href="#" className="hover:text-gray-300 transition-colors">Open Source</a>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b1f1c]"></span>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy First</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

/* Feature bullet checkmark helper */
function FeatureItem({ label }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-gray-400 font-medium">
      <div className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 select-none">
        <Check size={10} strokeWidth={3} />
      </div>
      <span className="select-none">{label}</span>
    </div>
  )
}

/* Code mockup badge list helper */
function FloatingBadge({ icon: Icon, customIcon, title, subtitle, colorClass, iconColor }) {
  return (
    <div className={`flex items-center justify-between p-2.5 px-3.5 rounded-xl border ${colorClass} shadow-md select-none`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 shrink-0">
          {customIcon ? customIcon : <Icon size={14} className={iconColor} />}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[11px] font-bold text-white leading-tight">{title}</span>
          {subtitle && <span className="text-[9px] text-gray-500 leading-tight mt-0.5">{subtitle}</span>}
        </div>
      </div>
      <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
        <Check size={10} strokeWidth={3.5} />
      </div>
    </div>
  )
}

/* Theme selector dropdown component */
function ThemeSelector() {
  const theme = useThemeStore((s) => s.theme)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const getThemeLabel = (t) => {
    switch (t) {
      case "dark": return "Dark"
      case "light": return "Light"
      case "system": return "System"
      default: return "Theme"
    }
  }

  const getThemeIcon = (t, resolved = false) => {
    const active = resolved ? resolvedTheme : t
    if (active === "dark") return <Moon size={14} className="text-gray-300" />
    if (active === "light") return <Sun size={14} className="text-amber-400" />
    return <Monitor size={14} className="text-gray-300" />
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1b1f1c] bg-[#0c0e0d] hover:bg-white/5 hover:border-gray-700 text-xs font-semibold text-gray-300 transition-all cursor-pointer shadow-sm select-none"
      >
        {getThemeIcon(theme, true)}
        <span>{getThemeLabel(theme)}</span>
        <ChevronDown size={12} className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-lg border border-[#1b1f1c] bg-[#0c0e0d] shadow-xl py-1 z-50 select-none">
          {["dark", "light", "system"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-xs text-left cursor-pointer transition-colors ${
                theme === t 
                  ? "bg-emerald-500/10 text-emerald-400 font-semibold" 
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {getThemeIcon(t)}
              <span>{getThemeLabel(t)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* Stat row item helper */
function StatItem({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center justify-start md:justify-center gap-4 px-4">
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-emerald-400 shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-base font-bold text-white font-mono leading-none">{value}</span>
        <span className="text-[10px] text-gray-500 leading-none mt-1.5">{label}</span>
      </div>
    </div>
  )
}

/* Custom 2x2 grid Launcher Cards */
function LauncherCard({ icon: Icon, title, desc, colorTheme, onClick }) {
  // Theme styling mapping
  const colorConfigs = {
    green: {
      borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    },
    purple: {
      borderHover: "hover:border-purple-500/40 hover:shadow-purple-500/5",
      iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-400"
    },
    blue: {
      borderHover: "hover:border-blue-500/40 hover:shadow-blue-500/5",
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-400"
    },
    orange: {
      borderHover: "hover:border-orange-500/40 hover:shadow-orange-500/5",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-400"
    }
  }

  const { borderHover, iconBg } = colorConfigs[colorTheme]

  return (
    <button
      onClick={onClick}
      className={`bg-[#060807] border border-[#171a18] rounded-2xl p-3 text-left flex flex-col justify-between items-start h-[115px] lg:h-[110px] xl:h-[115px] w-full transition-all hover:-translate-y-0.5 cursor-pointer select-none ${borderHover}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg border ${iconBg}`}>
          <Icon size={14} />
        </div>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0">
          <ArrowRight size={10} />
        </div>
      </div>
      <div className="space-y-0.5 mt-auto">
        <div className="text-xs font-bold text-white leading-tight">{title}</div>
        <div className="text-[9px] lg:text-[8.5px] xl:text-[9px] text-gray-500 leading-tight line-clamp-2">{desc}</div>
      </div>
    </button>
  )
}
