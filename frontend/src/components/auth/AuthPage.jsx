import { useState, useRef, useEffect } from "react"
import { 
  Sun, Moon, Code2, Loader2, ArrowRight, Zap, RefreshCw, 
  MessageSquare, Network, BookOpen, Terminal, 
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
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-6 py-4 lg:py-2 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:items-stretch items-center z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Left Side: Product Description */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left h-full min-h-0 gap-10 lg:gap-12">
          <div className="flex flex-col space-y-5 lg:space-y-6">
            <h1 className="text-hero font-display text-white">
              One Workspace. <br />
              Four Developer <br />
              Superpowers.
            </h1>

            <p className="text-body font-body text-gray-400 leading-relaxed max-w-xl text-justify">
              AI-powered workspace to explain, optimize, convert, and document code.
            </p>
          </div>
        </div>

        {/* Right Side: Welcome / Interactive Launcher Grid */}
        <div className="lg:col-span-5 w-full flex flex-col items-center h-full">
          <div className="w-full h-full max-w-[465px] bg-[#0c0e0d] border border-[#1b1f1c] rounded-[24px] p-7 lg:p-8 flex flex-col justify-between shadow-2xl relative">
            <div className="space-y-1.5 text-left">
              <h2 className="text-2xl font-bold text-white tracking-tight">Start Building</h2>
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

            {/* Buttons Group */}
            <div className="flex flex-col gap-3">
              {/* Launch Workspace Main CTA */}
              <button
                onClick={() => handleLaunch("explainer", "Overview")}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <Rocket size={16} />
                <span>Launch Workspace</span>
              </button>

              {/* Open Local File button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-3 border border-[#1e2220] hover:border-gray-700 bg-transparent hover:bg-white/5 rounded-xl flex flex-col items-center justify-center gap-0.5 active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FolderOpen size={14} className="text-emerald-400" />
                  <span>Open Local File</span>
                </div>
                <span className="text-[9px] text-gray-500 leading-none">Work with your existing code</span>
              </button>
            </div>
          </div>
        </div>
      </main>



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
      className={`bg-[#060807] border border-[#171a18] rounded-2xl p-4 text-left flex flex-col justify-between items-start h-[135px] w-full transition-all hover:-translate-y-0.5 cursor-pointer select-none ${borderHover}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${iconBg}`}>
          <Icon size={15} />
        </div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 text-gray-400 shrink-0">
          <ArrowRight size={11} />
        </div>
      </div>
      <div className="space-y-1 mt-auto">
        <div className="text-xs font-bold text-white leading-tight">{title}</div>
        <div className="text-[9.5px] xl:text-[10px] text-gray-500 leading-tight line-clamp-2">{desc}</div>
      </div>
    </button>
  )
}
