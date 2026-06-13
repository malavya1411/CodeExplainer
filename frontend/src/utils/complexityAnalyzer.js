// Lightweight static complexity estimator. Heuristic, not a real parser, but
// produces believable Big-O + cyclomatic numbers from structural cues.

export function analyzeComplexity(code, language = "javascript") {
  if (!code || !code.trim()) {
    return {
      time: "O(1)",
      space: "O(1)",
      cyclomatic: 1,
      maxLoopDepth: 0,
      hasRecursion: false,
      rating: "good",
    }
  }

  const lines = code.split("\n")
  const loopRegex = /\b(for|while|forEach|map|filter|reduce)\b/
  const decisionRegex = /\b(if|else if|elif|case|catch|&&|\|\||\?)\b/

  // Estimate maximum nested loop depth using brace / indentation cues.
  let maxDepth = 0
  let currentDepth = 0
  const depthStack = []

  for (const raw of lines) {
    const line = raw.trim()
    if (loopRegex.test(line)) {
      currentDepth += 1
      maxDepth = Math.max(maxDepth, currentDepth)
      depthStack.push(currentDepth)
    }
    // crude close detection
    const opens = (raw.match(/{/g) || []).length
    const closes = (raw.match(/}/g) || []).length
    if (closes > opens && depthStack.length) {
      for (let i = 0; i < closes - opens; i++) {
        if (depthStack.length) {
          depthStack.pop()
          currentDepth = Math.max(0, currentDepth - 1)
        }
      }
    }
  }

  // Cyclomatic complexity = decision points + 1
  let decisionPoints = 0
  for (const raw of lines) {
    const matches = raw.match(/\b(if|else if|elif|case|catch|while|for)\b/g)
    if (matches) decisionPoints += matches.length
    const logical = raw.match(/(&&|\|\|)/g)
    if (logical) decisionPoints += logical.length
  }
  const cyclomatic = decisionPoints + 1

  // Recursion detection: a function name called inside its own body.
  const fnNames = [...code.matchAll(/(?:function|def|fn|func)\s+(\w+)/g)].map((m) => m[1])
  let hasRecursion = false
  for (const name of fnNames) {
    const calls = (code.match(new RegExp(`\\b${name}\\s*\\(`, "g")) || []).length
    if (calls > 1) hasRecursion = true
  }

  const usesBinarySearch = /\b(left|low)\b/.test(code) && /\b(right|high|mid)\b/.test(code)
  const usesSort = /\.sort\(|sorted\(|sort\(/.test(code)

  let time = "O(1)"
  if (maxDepth >= 3) time = "O(n³)"
  else if (maxDepth === 2) time = "O(n²)"
  else if (hasRecursion && usesBinarySearch) time = "O(log n)"
  else if (hasRecursion) time = "O(2ⁿ)"
  else if (usesSort) time = "O(n log n)"
  else if (usesBinarySearch && maxDepth >= 1) time = "O(log n)"
  else if (maxDepth === 1) time = "O(n)"

  // Space estimate
  let space = "O(1)"
  const allocsArray = /(\[\]|new Array|list\(|Array\(|\{\}|new Map|new Set|append|push)/.test(code)
  if (hasRecursion) space = "O(n)"
  else if (maxDepth >= 1 && allocsArray) space = "O(n)"

  const rating = ratingFor(time)

  return {
    time,
    space,
    cyclomatic,
    maxLoopDepth: maxDepth,
    hasRecursion,
    rating,
    lineCount: lines.length,
  }
}

const ORDER = ["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)"]

export function ratingFor(time) {
  const idx = ORDER.indexOf(time)
  if (idx <= 2) return "good"
  if (idx <= 3) return "moderate"
  return "poor"
}

// Generates n vs operations data points for the growth chart.
export function growthData(time) {
  const ns = [10, 50, 100, 500, 1000]
  const fn = growthFn(time)
  return ns.map((n) => ({ n: n.toString(), operations: Math.round(fn(n)) }))
}

function growthFn(time) {
  switch (time) {
    case "O(1)":
      return () => 1
    case "O(log n)":
      return (n) => Math.log2(n)
    case "O(n)":
      return (n) => n
    case "O(n log n)":
      return (n) => n * Math.log2(n)
    case "O(n²)":
      return (n) => n * n
    case "O(n³)":
      return (n) => n * n * n
    case "O(2ⁿ)":
      return (n) => Math.min(Math.pow(2, Math.min(n, 20)), 1e9)
    default:
      return (n) => n
  }
}

export function ratingColor(rating) {
  if (rating === "good") return "var(--success)"
  if (rating === "moderate") return "var(--warning)"
  return "var(--error)"
}
