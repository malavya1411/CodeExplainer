export const SUPPORTED_LANGUAGES = [
  { id: "python", label: "Python", ext: ["py"], monaco: "python" },
  { id: "javascript", label: "JavaScript", ext: ["js", "jsx", "mjs"], monaco: "javascript" },
  { id: "typescript", label: "TypeScript", ext: ["ts", "tsx"], monaco: "typescript" },
  { id: "java", label: "Java", ext: ["java"], monaco: "java" },
  { id: "cpp", label: "C++", ext: ["cpp", "cc", "cxx", "hpp", "h"], monaco: "cpp" },
  { id: "go", label: "Go", ext: ["go"], monaco: "go" },
  { id: "rust", label: "Rust", ext: ["rs"], monaco: "rust" },
  { id: "csharp", label: "C#", ext: ["cs"], monaco: "csharp" },
  { id: "ruby", label: "Ruby", ext: ["rb"], monaco: "ruby" },
  { id: "php", label: "PHP", ext: ["php"], monaco: "php" },
]

export const SUPPORTED_EXTENSIONS = SUPPORTED_LANGUAGES.flatMap((l) => l.ext)

export function getMonacoLanguage(langId) {
  const found = SUPPORTED_LANGUAGES.find((l) => l.id === langId)
  return found ? found.monaco : "plaintext"
}

export function detectLanguageFromExtension(filename) {
  const ext = filename.split(".").pop()?.toLowerCase()
  const found = SUPPORTED_LANGUAGES.find((l) => l.ext.includes(ext))
  return found ? found.id : null
}

// Heuristic content-based detection used when typing / pasting.
export function detectLanguageFromContent(code) {
  if (!code || !code.trim()) return "javascript"
  const c = code

  if (/\bdef\s+\w+\s*\(.*\):/.test(c) || /\bimport\s+\w+/.test(c) && /:\s*$/m.test(c) && !/[;{]/.test(c))
    return "python"
  if (/\bpackage\s+main\b/.test(c) || /\bfunc\s+\w+\s*\(/.test(c) || /:=/.test(c)) return "go"
  if (/\bfn\s+\w+\s*\(/.test(c) || /\blet\s+mut\b/.test(c) || /println!/.test(c)) return "rust"
  if (/#include\b/.test(c) || /std::/.test(c) || /\bcout\b/.test(c)) return "cpp"
  if (/\busing\s+System\b/.test(c) || /\bConsole\.Write/.test(c) || /\bnamespace\b/.test(c)) return "csharp"
  if (
    /\bpublic\s+class\b/.test(c) || 
    /System\.out\.println/.test(c) ||
    /\b(?:public|private|protected)\s+(?:static\s+)?(?:void|int|double|float|boolean|char|long|short|byte|String)(?:\[\])?\s+\w+\s*\(/.test(c) ||
    /\bclass\s+\w+\s*\{/.test(c) && /\b(?:public|private|protected)\s+/.test(c) ||
    /System\.out\./.test(c) ||
    /\bclass\s+\w+\s+(?:implements|extends)\b/.test(c) ||
    /@Override\b/.test(c)
  )
    return "java"
  if (/<\?php/.test(c) || /\$\w+\s*=/.test(c)) return "php"
  if (/\bdef\s+\w+/.test(c) && /\bend\b/.test(c) || /\bputs\b/.test(c)) return "ruby"
  if (/:\s*(string|number|boolean|void|any)\b/.test(c) || /\binterface\s+\w+/.test(c)) return "typescript"
  return "javascript"
}

export function getLanguageLabel(langId) {
  const found = SUPPORTED_LANGUAGES.find((l) => l.id === langId)
  return found ? found.label : "Plain Text"
}
