import { useState } from "react"
import { Github, Chrome, Mail, Lock, Code2, Check, Sun, Moon, Loader2 } from "lucide-react"
import { useAuthStore } from "../../stores/authStore.js"
import { useThemeStore } from "../../stores/themeStore.js"
import { Button } from "../shared/Button.jsx"
import { toast } from "../shared/Toast.jsx"

export function AuthPage() {
  const login = useAuthStore((s) => s.login)
  const signup = useAuthStore((s) => s.signup)
  const isLoading = useAuthStore((s) => s.isLoading)

  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  const [view, setView] = useState("login") // "login" | "signup"
  
  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  
  // Error states
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      if (view === "login") {
        await login(email, password)
        toast.success("Successfully signed in!")
      } else {
        await signup(email, password)
        toast.success("Successfully registered account!")
      }
    } catch (err) {
      toast.error("Authentication failed. Please check your credentials.")
    }
  }

  const handleSocialLogin = async (provider) => {
    toast.info(`Connecting to ${provider}... (mock)`)
    // Mock social login trigger
    await login(`${provider.toLowerCase()}user@example.com`, "socialpassword123")
    toast.success(`Signed in with ${provider}!`)
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

        {/* Right Side: Authentication Panel */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[var(--bg-primary)] relative">
          
          {/* Logo only visible on mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-8 select-none">
            <div className="flex items-center justify-center w-9 h-9 rounded bg-[var(--accent-primary)] text-[var(--accent-on)]">
              <Code2 size={18} />
            </div>
            <span className="text-base font-bold text-[var(--text-primary)]">CodeExplainer</span>
          </div>

          {/* Auth Card */}
          <div className="w-full max-w-[400px] premium-card p-8 space-y-6 animate-fade-in relative">
            
            {/* Loading Cover Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[var(--bg-secondary)]/85 backdrop-blur-[1px] rounded-xl select-none">
                <Loader2 size={28} className="animate-spin text-[var(--accent-primary)]" />
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                  {view === "login" ? "Signing in..." : "Creating account..."}
                </p>
              </div>
            )}

            {/* Header Text */}
            <div className="text-center space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                {view === "login" ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {view === "login"
                  ? "Enter your details to access your account"
                  : "Get started for free today"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-[var(--text-secondary)]">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)] pointer-events-none">
                    <Mail size={14} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: null })
                    }}
                    placeholder="you@example.com"
                    className={`w-full text-sm rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] pl-9 pr-3 py-2 border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-all ${
                      errors.email ? "border-[var(--error)] focus:ring-[var(--error)]" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-medium text-[var(--error)]">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-xs font-semibold text-[var(--text-secondary)]">
                    Password
                  </label>
                  {view === "login" && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        toast.info("Password reset request sent... (mock)")
                      }}
                      className="text-[10px] text-[var(--accent-primary)] hover:underline font-medium"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)] pointer-events-none">
                    <Lock size={14} />
                  </span>
                  <input
                    id="password"
                    type="password"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: null })
                    }}
                    placeholder="••••••••"
                    className={`w-full text-sm rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] pl-9 pr-3 py-2 border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)] transition-all ${
                      errors.password ? "border-[var(--error)] focus:ring-[var(--error)]" : ""
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-[10px] font-medium text-[var(--error)]">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              {view === "login" && (
                <div className="flex items-center gap-2 select-none">
                  <input
                    id="remember"
                    type="checkbox"
                    disabled={isLoading}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[var(--accent-primary)] h-3.5 w-3.5 rounded border-[var(--border)] bg-[var(--bg-primary)]"
                  />
                  <label htmlFor="remember" className="text-xs text-[var(--text-secondary)] cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>
              )}

              {/* Action Button */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="w-full justify-center"
              >
                {view === "login" ? "Sign In" : "Sign Up"}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-full border-t border-[var(--border)]"></span>
              <span className="relative bg-[var(--bg-secondary)] px-3 text-[10px] uppercase font-bold text-[var(--text-muted)] select-none">
                Or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialLogin("GitHub")}
                className="flex items-center justify-center gap-2 text-xs font-semibold rounded-lg py-2.5 border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors active:scale-[0.98] cursor-pointer"
              >
                <Github size={15} />
                GitHub
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 text-xs font-semibold rounded-lg py-2.5 border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors active:scale-[0.98] cursor-pointer"
              >
                <Chrome size={15} />
                Google
              </button>
            </div>

            {/* Toggle View Link */}
            <div className="text-center text-xs">
              <span className="text-[var(--text-secondary)]">
                {view === "login" ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setView(view === "login" ? "signup" : "login")
                  setErrors({})
                }}
                className="text-[var(--accent-primary)] font-bold hover:underline"
              >
                {view === "login" ? "Sign Up" : "Sign In"}
              </button>
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
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--success)_12%,transparent)] text-[var(--success)]">
        <Check size={12} strokeWidth={3} />
      </div>
      <span>{label}</span>
    </div>
  )
}
