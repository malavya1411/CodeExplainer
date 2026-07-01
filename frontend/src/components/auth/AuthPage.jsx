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

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const isLight = resolvedTheme === "light"

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
      

      
      {/* Hidden File Input */}
      <input 
        ref={fileRef}
        type="file" 
        onChange={handleFileChange}
        accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.cc,.go,.rs,.cs,.rb,.php"
        className="hidden" 
      />

      {/* Header section */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 lg:py-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 border border-[var(--border)] bg-emerald-500/10 dark:bg-[#1c3024] text-emerald-600 dark:text-[#4ede7d] dark:border-[#2e5a3c]"
            style={isLight ? { background: "var(--color-ink, #111)", color: "#fff", border: "1px solid var(--color-ink,#111)" } : {}}
          >
            <Code2 size={20} />
          </div>
          <div>
            <span
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block font-body"
              style={isLight ? { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", color: "var(--color-ink, #111)" } : {}}
            >
              CodeExplainer
            </span>
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
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-6 py-4 lg:py-2 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:items-stretch items-center z-10 overflow-y-auto lg:overflow-visible relative">
        
        {/* Left Side: Product Description */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left h-full min-h-0 gap-10 lg:gap-12 relative z-10">
          <div className="flex flex-col space-y-5 lg:space-y-6">
            <h1
              className="text-hero font-display text-slate-900 dark:text-white"
              style={isLight ? { color: "var(--color-ink, #111111)" } : {}}
            >
              One Workspace. <br />
              Four Developer <br />
              Superpowers.
            </h1>

            <p
              className="text-body font-body text-slate-600 dark:text-gray-400 leading-relaxed max-w-xl text-justify"
              style={isLight ? { color: "var(--text-secondary, #333)" } : {}}
            >
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
          {/* Neubrutalism card in light mode, soft gradient card in dark mode */}
          <div
            className="w-full h-full max-w-[465px] bg-white dark:bg-[#090b0a]/90 backdrop-blur-md border border-slate-100 dark:border-[#1a1f1c] rounded-[28px] p-7 lg:p-8 flex flex-col justify-between shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300"
            style={isLight ? {
              border: "1px solid var(--color-ink, #111)",
              boxShadow: "8px 8px 0px var(--color-ink, #111)",
              borderRadius: "0px",
              background: "var(--bg-secondary, #fff)",
            } : {}}
          >
            {/* Ambient background glow inside the card (only in dark mode) */}
            {!isLight && (
              <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />
            )}

            {/* Header stripe — yellow accent bar in light mode, normal top text in dark mode */}
            <div
              className="px-7 pt-6 pb-4 border-b border-transparent dark:border-transparent"
              style={isLight ? {
                background: "var(--accent-nav, #F4C542)",
                borderBottom: "1px solid var(--color-ink, #111)",
                marginLeft: "-32px",
                marginRight: "-32px",
                marginTop: "-32px",
              } : {}}
            >
              <h2
                className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight"
                style={isLight ? { fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", color: "var(--color-ink, #111)" } : {}}
              >
                Start Building
              </h2>
              <p
                className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mt-0.5"
                style={isLight ? { color: "var(--color-ink, #111)", opacity: 0.6 } : {}}
              >
                Choose where you want to begin
              </p>
            </div>

            {/* Grid of Launcher Cards */}
            <div
              className="grid grid-cols-2 grid-rows-2 gap-3 flex-1 relative z-10"
              style={isLight ? {
                gap: "0px",
                borderBottom: "1px solid var(--color-ink, #111)",
                marginLeft: "-32px",
                marginRight: "-32px",
              } : {}}
            >
              <LauncherCard 
                icon={BookOpen}
                title="Explain Code"
                desc="AI explanations at multiple levels."
                colorHex="#4CAF6D"
                colorTheme="green"
                onClick={() => handleLaunch("explainer", "Overview")}
                borderRight borderBottom
              />
              <LauncherCard 
                icon={Zap}
                title="Optimize Code"
                desc="Performance & readability improvements."
                colorHex="#3B4CCA"
                colorTheme="purple"
                onClick={() => handleLaunch("optimizer")}
                borderBottom
              />
              <LauncherCard 
                icon={RefreshCw}
                title="Convert Code"
                desc="Translate between 10+ languages."
                colorHex="#E85CA8"
                colorTheme="blue"
                onClick={() => handleLaunch("converter")}
                borderRight
              />
              <LauncherCard 
                icon={MessageSquare}
                title="Add Comments"
                desc="Generate production-ready docs."
                colorHex="#F4A010"
                colorTheme="orange"
                onClick={() => handleLaunch("explainer", "Comments")}
              />
            </div>

            {/* Buttons Group */}
            <div className="flex flex-col gap-3 relative z-10 pt-4" style={isLight ? { gap: "0px", padding: "28px 0 0 0" } : {}}>
              {/* Launch Workspace Main CTA */}
              <button
                onClick={() => handleLaunch("explainer", "Overview")}
                className="group w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                style={isLight ? {
                  background: "var(--color-ink, #111)",
                  color: "var(--bg-secondary, #fff)",
                  border: "1px solid var(--color-ink, #111)",
                  boxShadow: "4px 4px 0px var(--accent-nav, #F4C542)",
                  borderRadius: "0px",
                  textTransform: "uppercase",
                  fontWeight: "900",
                  letterSpacing: "0.05em",
                } : {}}
                onMouseEnter={e => { if (isLight) { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px var(--accent-nav, #F4C542)"; } }}
                onMouseLeave={e => { if (isLight) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px var(--accent-nav, #F4C542)"; } }}
                onMouseDown={e => { if (isLight) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px var(--accent-nav, #F4C542)"; } }}
                onMouseUp={e => { if (isLight) { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px var(--accent-nav, #F4C542)"; } }}
              >
                <Rocket size={15} />
                <span>Launch Workspace</span>
              </button>

              {/* Open Local File button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-3 border border-slate-200 dark:border-[#1e2220] hover:border-emerald-500/20 dark:hover:border-emerald-500/25 bg-white dark:bg-transparent hover:bg-emerald-500/[0.02] rounded-xl flex flex-col items-center justify-center gap-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer group/file shadow-sm dark:shadow-none"
                style={isLight ? {
                  background: "var(--bg-secondary, #fff)",
                  color: "var(--color-ink, #111)",
                  border: "1px solid var(--color-ink, #111)",
                  boxShadow: "3px 3px 0px var(--color-ink, #111)",
                  borderRadius: "0px",
                  textTransform: "uppercase",
                  fontWeight: "700",
                  letterSpacing: "0.025em",
                  marginTop: "12px",
                } : {}}
                onMouseEnter={e => { if (isLight) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--color-ink, #111)"; } }}
                onMouseLeave={e => { if (isLight) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0px var(--color-ink, #111)"; } }}
                onMouseDown={e => { if (isLight) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "1px 1px 0px var(--color-ink, #111)"; } }}
                onMouseUp={e => { if (isLight) { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--color-ink, #111)"; } }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FolderOpen size={14} className="text-emerald-600 dark:text-emerald-400 group-hover/file:scale-110 transition-transform duration-300"
                    style={isLight ? { color: "var(--accent-primary, #3B4CCA)" } : {}} />
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
  const isLight = resolvedTheme === "light"

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-[#1b1f1c] bg-white dark:bg-[#0c0e0d] hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-gray-700 text-slate-700 dark:text-gray-300 transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden active:scale-95 group"
      style={isLight ? {
        border: "1px solid var(--color-ink, #111)",
        background: "var(--bg-secondary, #fff)",
        color: "var(--color-ink, #111)",
        boxShadow: "3px 3px 0px var(--color-ink, #111)",
        borderRadius: "0px",
      } : {}}
      aria-label="Toggle theme"
    >
      <div className="relative w-4 h-4 transition-transform duration-500 rotate-0 dark:rotate-[360deg]">
        <Sun size={16} className="absolute inset-0 transition-opacity duration-300 opacity-100 dark:opacity-0 text-amber-500" />
        <Moon size={16} className="absolute inset-0 transition-opacity duration-300 opacity-0 dark:opacity-100 text-blue-400" />
      </div>
    </button>
  )
}

/* Custom neubrutalism Launcher Cards */
function LauncherCard({ icon: Icon, title, desc, colorHex = "#F4C542", colorTheme, onClick, borderRight, borderBottom }) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const isLight = resolvedTheme === "light"

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

  const { borderHover, iconBg } = colorConfigs[colorTheme] || colorConfigs.green

  if (isLight) {
    return (
      <button
        onClick={onClick}
        className="group flex flex-col justify-between items-start p-4 text-left h-full w-full transition-all duration-150 cursor-pointer select-none relative"
        style={{
          background: "var(--bg-secondary, #fff)",
          borderRight: borderRight ? "1px solid var(--color-ink, #111)" : undefined,
          borderBottom: borderBottom ? "1px solid var(--color-ink, #111)" : undefined,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = colorHex + "18"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-secondary, #fff)"; }}
      >
        {/* Color accent top-left bar */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: colorHex }} />

        <div className="flex justify-between items-center w-full pl-3">
          <div
            className="flex items-center justify-center w-8 h-8 border border-[var(--color-ink,#111)]"
            style={{ background: colorHex }}
          >
            <Icon size={14} style={{ color: "var(--color-ink, #111)" }} />
          </div>
          <ArrowRight size={11} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" style={{ color: "var(--color-ink, #111)" }} />
        </div>
        <div className="space-y-0.5 mt-auto pl-3">
          <div
            className="text-xs font-black uppercase tracking-wide leading-tight"
            style={{ color: "var(--color-ink, #111)", fontFamily: "var(--font-display, 'Archivo Black', sans-serif)" }}
          >
            {title}
          </div>
          <div className="text-[9.5px] leading-tight opacity-60" style={{ color: "var(--text-secondary, #333)" }}>
            {desc}
          </div>
        </div>
      </button>
    )
  }

  // Original Dark Mode Card:
  return (
    <button
      onClick={onClick}
      className={`group bg-white dark:bg-[#080909] border border-slate-100 dark:border-[#141615] rounded-2xl p-4 text-left flex flex-col justify-between items-start h-full w-full transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none ${borderHover}`}
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
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const isLight = resolvedTheme === "light"

  if (isLight) {
    return (
      <div className="flex items-center gap-2.5 text-xs font-bold" style={{ color: "var(--text-secondary, #333)" }}>
        <div
          className="flex items-center justify-center w-4 h-4 shrink-0 border border-[var(--color-ink,#111)]"
          style={{ background: "var(--accent-primary, #3B4CCA)" }}
        >
          <Check size={9} strokeWidth={3.5} style={{ color: "#fff" }} />
        </div>
        <span className="leading-tight">{label}</span>
      </div>
    )
  }

  // Original FeatureItem for dark mode:
  return (
    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-gray-400">
      <div className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20 dark:border-emerald-500/30">
        <Check size={11} strokeWidth={3.5} />
      </div>
      <span className="leading-tight">{label}</span>
    </div>
  )
}

