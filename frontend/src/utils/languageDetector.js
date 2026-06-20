export const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: ["js", "jsx", "mjs"], monaco: "javascript", fileExtension: "js" },
  { id: "typescript", label: "TypeScript", ext: ["ts", "tsx"], monaco: "typescript", fileExtension: "ts" },
  { id: "python",     label: "Python",     ext: ["py"],              monaco: "python",     fileExtension: "py" },
  { id: "java",       label: "Java",       ext: ["java"],            monaco: "java",       fileExtension: "java" },
  { id: "cpp",        label: "C++",        ext: ["cpp", "cc", "cxx", "hpp", "h"], monaco: "cpp", fileExtension: "cpp" },
  { id: "c",          label: "C",          ext: ["c"],               monaco: "c",          fileExtension: "c" },
  { id: "csharp",     label: "C#",         ext: ["cs"],              monaco: "csharp",     fileExtension: "cs" },
  { id: "go",         label: "Go",         ext: ["go"],              monaco: "go",         fileExtension: "go" },
  { id: "rust",       label: "Rust",       ext: ["rs"],              monaco: "rust",       fileExtension: "rs" },
  { id: "php",        label: "PHP",        ext: ["php"],             monaco: "php",        fileExtension: "php" },
  { id: "ruby",       label: "Ruby",       ext: ["rb"],              monaco: "ruby",       fileExtension: "rb" },
  { id: "kotlin",     label: "Kotlin",     ext: ["kt", "kts"],       monaco: "kotlin",     fileExtension: "kt" },
  { id: "swift",      label: "Swift",      ext: ["swift"],           monaco: "swift",      fileExtension: "swift" },
]

export const SUPPORTED_EXTENSIONS = SUPPORTED_LANGUAGES.flatMap((l) => l.ext)

export function getMonacoLanguage(langId) {
  const found = SUPPORTED_LANGUAGES.find((l) => l.id === langId)
  return found ? found.monaco : "plaintext"
}

export function getFileExtension(langId) {
  const found = SUPPORTED_LANGUAGES.find((l) => l.id === langId)
  return found ? found.fileExtension : "txt"
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
  if (/#include\b/.test(c) && /\bstd::\b/.test(c)) return "cpp"
  if (/#include\b/.test(c) && /\bprintf\b/.test(c) && !/std::/.test(c)) return "c"
  if (/\busing\s+System\b/.test(c) || /\bConsole\.Write/.test(c) || /\bnamespace\b/.test(c)) return "csharp"
  if (/\bfun\s+\w+\s*\(/.test(c) && (/\bval\b/.test(c) || /\bvar\b/.test(c)) && /:\s*\w+\b/.test(c)) return "kotlin"
  if (/\bfunc\s+\w+\s*\(/.test(c) && /\bvar\b|\blet\b/.test(c) && /\bSwift\b|\bUIKit\b|\bFoundation\b/.test(c)) return "swift"
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
  if (/\<\?php/.test(c) || /\$\w+\s*=/.test(c)) return "php"
  if (/\bdef\s+\w+/.test(c) && /\bend\b/.test(c) || /\bputs\b/.test(c)) return "ruby"
  if (/:\s*(string|number|boolean|void|any)\b/.test(c) || /\binterface\s+\w+/.test(c)) return "typescript"
  return "javascript"
}

export function getLanguageLabel(langId) {
  const found = SUPPORTED_LANGUAGES.find((l) => l.id === langId)
  return found ? found.label : "Plain Text"
}
