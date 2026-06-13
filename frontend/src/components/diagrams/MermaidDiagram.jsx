import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"
import { useThemeStore } from "../../stores/themeStore.js"

let initialized = false
let counter = 0

export function MermaidDiagram({ definition, ariaLabel }) {
  const ref = useRef(null)
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme)
  const [error, setError] = useState(null)
  const [id] = useState(() => `mmd-${++counter}`)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === "dark" ? "dark" : "neutral",
      securityLevel: "loose",
      themeVariables:
        resolvedTheme === "dark"
          ? {
              primaryColor: "#21262D",
              primaryTextColor: "#C9D1D9",
              primaryBorderColor: "#58A6FF",
              lineColor: "#8B949E",
              background: "#0D1117",
            }
          : {
              primaryColor: "#F3F0E2",
              primaryTextColor: "#3A3A35",
              primaryBorderColor: "#2D6A4F",
              lineColor: "#6B6B63",
              background: "#FAF9F5",
            },
    })
    initialized = true

    let cancelled = false
    mermaid
      .render(id, definition)
      .then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || "Could not render diagram")
      })
    return () => {
      cancelled = true
    }
  }, [definition, resolvedTheme, id])

  if (error) {
    return (
      <div className="text-xs text-[var(--error)] p-3" role="alert">
        Could not render diagram: {error}
      </div>
    )
  }

  return <div ref={ref} role="img" aria-label={ariaLabel} className="flex justify-center [&_svg]:max-w-full [&_svg]:h-auto" />
}
