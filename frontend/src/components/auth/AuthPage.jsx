import { useState, useRef, useEffect } from "react"
import { 
  Sun, Moon, Code2, Check, Loader2, ArrowRight, Zap, RefreshCw, 
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
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-transparent text-slate-800 dark:text-[#F5F4EE] flex flex-col justify-between relative transition-colors duration-300">
      
      {/* Decorative topographic lines in light mode / subtle opacity in dark mode */}
      <div className="absolute bottom-0 left-0 w-full max-w-[500px] h-[300px] pointer-events-none opacity-40 dark:opacity-10 z-0">
        <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-500/20 dark:text-emerald-500/5">
          <path d="M-50,280 C100,290 200,240 300,270 C400,300 450,220 550,240" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
          <path d="M-50,240 C80,250 180,190 280,220 C380,250 430,170 530,190" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-50,200 C60,210 160,140 260,170 C360,200 410,120 510,140" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
          <path d="M-50,160 C40,170 140,90 240,120 C340,150 390,70 490,90" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      
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
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-[#1c3024] text-emerald-600 dark:text-[#4ede7d] border border-emerald-500/20 dark:border-[#2e5a3c]">
            <Code2 size={22} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block font-body">CodeExplainer</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSelector />
        </div>
      </header>

      {/* Loading Cover Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/90 dark:bg-[#070908]/90 backdrop-blur-sm select-none">
          <Loader2 size={36} className="animate-spin text-[#4ede7d]" />
          <p className="text-sm font-semibold text-slate-800 dark:text-gray-300">
            Launching Workspace...
          </p>
        </div>
      )}
      {/* Main split content section */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-6 py-4 lg:py-2 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:items-stretch items-center z-10 overflow-y-auto lg:overflow-visible">
        
        {/* Left Side: Product Description */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left h-full min-h-0 gap-10 lg:gap-12 relative z-10">
          <div className="flex flex-col space-y-5 lg:space-y-6">
            <h1 className="text-hero font-display text-slate-900 dark:text-white">
              One Workspace. <br />
              Four Developer <br />
              Superpowers.
            </h1>

            <p className="text-body font-body text-slate-600 dark:text-gray-400 leading-relaxed max-w-xl text-justify">
              AI-powered workspace to explain, optimize, convert, and document code.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 pt-6 max-w-xl select-none">
              <FeatureItem label="Understand Complex Code" />
              <FeatureItem label="Improve Code Quality" />
              <FeatureItem label="Convert Any Language" />
              <FeatureItem label="Document Effortlessly" />
            </div>
          </div>
        </div>

        {/* Right Side: Welcome / Interactive Launcher Grid */}
        <div className="lg:col-span-5 w-full flex flex-col items-center h-full">
          <div className="w-full h-full max-w-[465px] bg-white dark:bg-[#090b0a]/90 backdrop-blur-md border border-slate-100 dark:border-[#1a1f1c] rounded-[28px] p-7 lg:p-8 flex flex-col justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
            {/* Ambient background glow inside the card */}
            <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.02),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />
            
            <div className="space-y-1.5 text-left relative z-10">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Start Building</h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">Choose where you want to begin</p>
            </div>

            {/* Grid of Launcher Cards */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
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
            <div className="flex flex-col gap-3 relative z-10">
              {/* Launch Workspace Main CTA */}
              <button
                onClick={() => handleLaunch("explainer", "Overview")}
                className="group w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <Rocket size={15} className="group-hover:animate-pulse transition-transform" />
                <span>Launch Workspace</span>
              </button>

              {/* Open Local File button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-3 border border-slate-200 dark:border-[#1e2220] hover:border-emerald-500/20 dark:hover:border-emerald-500/25 bg-white dark:bg-transparent hover:bg-emerald-500/[0.02] rounded-xl flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer group/file shadow-sm dark:shadow-none"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FolderOpen size={14} className="text-emerald-600 dark:text-emerald-400 group-hover/file:scale-110 transition-transform duration-300" />
                  <span>Open Local File</span>
                </div>
                <span className="text-[9px] text-slate-400 dark:text-gray-500 leading-none group-hover/file:text-slate-500 dark:group-hover/file:text-gray-400 transition-colors duration-300">Work with your existing code</span>
              </button>
            </div>
          </div>
        </div>
      </main>



    </div>
  )
}


/* Theme selector toggle component */
function ThemeSelector() {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-[#1b1f1c] bg-white dark:bg-[#0c0e0d] hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-gray-700 text-slate-700 dark:text-gray-300 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden active:scale-95 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 transition-transform duration-500 rotate-0 dark:rotate-[360deg]">
        <Sun size={16} className="absolute inset-0 transition-opacity duration-300 opacity-100 dark:opacity-0 text-amber-500" />
        <Moon size={16} className="absolute inset-0 transition-opacity duration-300 opacity-0 dark:opacity-100 text-blue-400" />
      </div>
    </button>
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
      borderHover: "hover:border-emerald-500/30 hover:bg-emerald-50/20 dark:hover:bg-[#0c1310]/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.03)]",
      iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform"
    },
    purple: {
      borderHover: "hover:border-purple-500/30 hover:bg-purple-50/20 dark:hover:bg-[#120e16]/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.03)]",
      iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"
    },
    blue: {
      borderHover: "hover:border-blue-500/30 hover:bg-blue-50/20 dark:hover:bg-[#0d1218]/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.03)]",
      iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"
    },
    orange: {
      borderHover: "hover:border-orange-500/30 hover:bg-amber-50/20 dark:hover:bg-[#16120d]/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.03)]",
      iconBg: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform"
    }
  }

  const { borderHover, iconBg } = colorConfigs[colorTheme]

  return (
    <button
      onClick={onClick}
      className={`group bg-white dark:bg-[#080909] border border-slate-100 dark:border-[#141615] rounded-2xl p-4 text-left flex flex-col justify-between items-start h-[135px] w-full transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none ${borderHover}`}
    >
      <div className="flex justify-between items-center w-full">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-300 ${iconBg}`}>
          <Icon size={15} />
        </div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 text-slate-400 dark:text-gray-500 group-hover:text-slate-900 dark:group-hover:text-white group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-all duration-300 shrink-0">
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </div>
      </div>
      <div className="space-y-1 mt-auto">
        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight transition-colors duration-300">{title}</div>
        <div className="text-[9.5px] xl:text-[10px] text-slate-500 dark:text-gray-400 transition-colors duration-300 leading-tight line-clamp-2">{desc}</div>
      </div>
    </button>
  )
}

/* Feature check list item helper */
function FeatureItem({ label }) {
  return (
    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-gray-400">
      <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20 dark:border-emerald-500/30">
        <Check size={11} strokeWidth={3.5} />
      </div>
      <span className="leading-tight">{label}</span>
    </div>
  )
}
