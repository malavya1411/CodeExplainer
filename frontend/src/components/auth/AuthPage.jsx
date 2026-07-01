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
      
      {/* Decorative corner accent — neubrutalism style */}
      <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none z-0 opacity-30 dark:opacity-10">
        <div className="absolute bottom-8 left-8 w-40 h-40 border border-[var(--color-ink,#111)] bg-[var(--warning,#F4C542)] dark:border-[#2A2F2B] dark:bg-transparent" />
        <div className="absolute bottom-4 left-4 w-40 h-40 border border-[var(--color-ink,#111)] bg-transparent dark:border-[#2A2F2B]" />
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
      <header className="w-full max-w-7xl mx-auto px-6 py-4 lg:py-3 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 border border-[var(--color-ink,#111)] dark:border-[#2A2F2B] dark:bg-[#1c3024] dark:text-[#4ede7d]"
            style={{ background: "var(--color-ink, #111)", color: "#fff" }}
          >
            <Code2 size={20} />
          </div>
          <div>
            <span
              className="text-lg font-black uppercase tracking-tight block dark:text-white"
              style={{ fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", color: "var(--color-ink, #111)" }}
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
            <h1 className="text-hero font-display" style={{ color: "var(--color-ink, #111111)" }}>
              One Workspace. <br />
              Four Developer <br />
              Superpowers.
            </h1>

            <p className="text-body font-body leading-relaxed max-w-xl text-justify dark:text-gray-400" style={{ color: "var(--text-secondary, #333)" }}>
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
          {/* Neubrutalism card — flat, bordered, offset shadow */}
          <div
            className="w-full h-full max-w-[465px] bg-[var(--bg-secondary,#fff)] dark:bg-[#090b0a] flex flex-col justify-between relative overflow-hidden"
            style={{
              border: "1px solid var(--color-ink, #111)",
              boxShadow: "8px 8px 0px var(--color-ink, #111)",
            }}
          >
            {/* Header stripe — yellow accent bar */}
            <div
              className="px-7 pt-6 pb-4 border-b border-[var(--color-ink,#111)] dark:border-[#1a1f1c]"
              style={{ background: "var(--accent-nav, #F4C542)" }}
            >
              <h2
                className="text-2xl font-black uppercase tracking-tight dark:text-white"
                style={{ fontFamily: "var(--font-display, 'Archivo Black', sans-serif)", color: "var(--color-ink, #111)" }}
              >
                Start Building
              </h2>
              <p className="text-xs font-bold uppercase tracking-wide mt-0.5 dark:text-gray-400" style={{ color: "var(--color-ink, #111)", opacity: 0.6 }}>
                Choose where you want to begin
              </p>
            </div>

            {/* Grid of Launcher Cards */}
            <div className="grid grid-cols-2 grid-rows-2 gap-0 flex-1 border-b border-[var(--color-ink,#111)] dark:border-[#1a1f1c]">
              <LauncherCard 
                icon={BookOpen}
                title="Explain Code"
                desc="AI explanations at multiple levels."
                colorHex="#4CAF6D"
                onClick={() => handleLaunch("explainer", "Overview")}
                borderRight borderBottom
              />
              <LauncherCard 
                icon={Zap}
                title="Optimize Code"
                desc="Performance & readability improvements."
                colorHex="#3B4CCA"
                onClick={() => handleLaunch("optimizer")}
                borderBottom
              />
              <LauncherCard 
                icon={RefreshCw}
                title="Convert Code"
                desc="Translate between 10+ languages."
                colorHex="#E85CA8"
                onClick={() => handleLaunch("converter")}
                borderRight
              />
              <LauncherCard 
                icon={MessageSquare}
                title="Add Comments"
                desc="Generate production-ready docs."
                colorHex="#F4A010"
                onClick={() => handleLaunch("explainer", "Comments")}
              />
            </div>

            {/* Buttons Group */}
            <div className="flex flex-col gap-0 p-7 pt-5">
              {/* Launch Workspace Main CTA */}
              <button
                onClick={() => handleLaunch("explainer", "Overview")}
                className="group w-full py-3.5 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150"
                style={{
                  background: "var(--color-ink, #111)",
                  color: "var(--bg-secondary, #fff)",
                  border: "1px solid var(--color-ink, #111)",
                  boxShadow: "4px 4px 0px var(--accent-nav, #F4C542)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px var(--accent-nav, #F4C542)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "4px 4px 0px var(--accent-nav, #F4C542)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0px var(--accent-nav, #F4C542)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translate(-2px,-2px)"; e.currentTarget.style.boxShadow = "6px 6px 0px var(--accent-nav, #F4C542)"; }}
              >
                <Rocket size={15} />
                <span>Launch Workspace</span>
              </button>

              {/* Open Local File button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full mt-3 py-3 font-bold uppercase tracking-wide text-xs flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-150"
                style={{
                  background: "var(--bg-secondary, #fff)",
                  color: "var(--color-ink, #111)",
                  border: "1px solid var(--color-ink, #111)",
                  boxShadow: "3px 3px 0px var(--color-ink, #111)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--color-ink, #111)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "3px 3px 0px var(--color-ink, #111)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "1px 1px 0px var(--color-ink, #111)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translate(-1px,-1px)"; e.currentTarget.style.boxShadow = "4px 4px 0px var(--color-ink, #111)"; }}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} style={{ color: "var(--accent-primary, #3B4CCA)" }} />
                  <span>Open Local File</span>
                </div>
                <span className="text-[9px] font-normal normal-case tracking-normal opacity-60">Work with your existing code</span>
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
      className="flex items-center justify-center w-9 h-9 cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5"
      style={{
        border: "1px solid var(--color-ink, #111)",
        background: "var(--bg-secondary, #fff)",
        color: "var(--color-ink, #111)",
        boxShadow: "3px 3px 0px var(--color-ink, #111)",
      }}
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
function LauncherCard({ icon: Icon, title, desc, colorHex = "#F4C542", onClick, borderRight, borderBottom }) {
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

/* Feature check list item helper */
function FeatureItem({ label }) {
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

