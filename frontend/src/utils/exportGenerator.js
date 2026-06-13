// Exports the explanation in several formats.

export function buildMarkdown({ code, language, explanation, depth, annotations }) {
  const lines = []
  lines.push(`# Code Explanation`)
  lines.push("")
  lines.push(`> ${explanation.summary}`)
  lines.push("")
  lines.push(`**Difficulty:** ${cap(explanation.difficulty)}  `)
  lines.push(`**Time Complexity:** ${explanation.overall_complexity.time}  `)
  lines.push(`**Space Complexity:** ${explanation.overall_complexity.space}`)
  lines.push("")
  lines.push(`## Source Code`)
  lines.push("")
  lines.push("```" + language)
  lines.push(code)
  lines.push("```")
  lines.push("")
  lines.push(`## Step-by-Step (${cap(depth)})`)
  lines.push("")
  explanation.blocks.forEach((b) => {
    lines.push(`### ${b.title} (lines ${b.line_start}–${b.line_end})`)
    lines.push("")
    lines.push(b[depth] || b.intermediate)
    if (b.analogy) {
      lines.push("")
      lines.push(`> Analogy: ${b.analogy}`)
    }
    lines.push("")
  })
  lines.push(`## Complexity Analysis`)
  lines.push("")
  lines.push(explanation.overall_complexity.explanation)
  lines.push("")
  if (annotations && Object.keys(annotations).length) {
    lines.push(`## Annotations`)
    lines.push("")
    Object.entries(annotations).forEach(([line, text]) => {
      lines.push(`- **Line ${line}:** ${text}`)
    })
    lines.push("")
  }
  return lines.join("\n")
}

export function buildHTML({ code, language, explanation, depth }) {
  const blocks = explanation.blocks
    .map(
      (b) => `
      <section class="card">
        <h3>${escapeHtml(b.title)} <span class="muted">lines ${b.line_start}–${b.line_end}</span></h3>
        <p>${escapeHtml(b[depth] || b.intermediate)}</p>
        ${b.analogy ? `<p class="analogy">Analogy: ${escapeHtml(b.analogy)}</p>` : ""}
      </section>`,
    )
    .join("")

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Code Explanation</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; background:#0d1117; color:#c9d1d9; }
  pre { background:#161b22; padding:1rem; border-radius:6px; overflow:auto; font-family: 'JetBrains Mono', monospace; }
  .card { border:1px solid #30363d; border-left:4px solid #58a6ff; border-radius:4px; padding:1rem; margin:1rem 0; background:#161b22; }
  .muted { color:#8b949e; font-weight:400; font-size:.85em; }
  .analogy { color:#8b949e; font-style:italic; }
  .badges span { display:inline-block; background:#21262d; border-radius:999px; padding:.2rem .7rem; margin-right:.4rem; font-size:.85em; }
  h1 { color:#58a6ff; }
</style></head>
<body>
  <h1>Code Explanation</h1>
  <p>${escapeHtml(explanation.summary)}</p>
  <div class="badges">
    <span>Difficulty: ${cap(explanation.difficulty)}</span>
    <span>Time: ${explanation.overall_complexity.time}</span>
    <span>Space: ${explanation.overall_complexity.space}</span>
  </div>
  <h2>Source Code</h2>
  <pre><code>${escapeHtml(code)}</code></pre>
  <h2>Explanation (${cap(depth)})</h2>
  ${blocks}
  <h2>Complexity</h2>
  <p>${escapeHtml(explanation.overall_complexity.explanation)}</p>
</body></html>`
}

export function buildNotion({ code, language, explanation, depth }) {
  // Notion import works well with clean markdown + callouts.
  const lines = []
  lines.push(`# Code Explanation`)
  lines.push("")
  lines.push(`> 💡 ${explanation.summary}`)
  lines.push("")
  lines.push("```" + language)
  lines.push(code)
  lines.push("```")
  lines.push("")
  explanation.blocks.forEach((b) => {
    lines.push(`## ${b.title}`)
    lines.push(b[depth] || b.intermediate)
    lines.push("")
  })
  return lines.join("\n")
}

export function downloadText(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function downloadPDF({ code, language, explanation, depth }) {
  const { default: jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 40
  let y = margin
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2

  const write = (text, size, style = "normal", color = [26, 29, 35]) => {
    doc.setFont("helvetica", style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const wrapped = doc.splitTextToSize(text, maxWidth)
    wrapped.forEach((ln) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(ln, margin, y)
      y += size * 1.4
    })
  }

  write("Code Explanation", 20, "bold", [45, 106, 79])
  y += 6
  write(explanation.summary, 11)
  y += 6
  write(
    `Difficulty: ${cap(explanation.difficulty)}   Time: ${explanation.overall_complexity.time}   Space: ${explanation.overall_complexity.space}`,
    10,
    "bold",
    [73, 80, 87],
  )
  y += 10
  write("Source Code", 14, "bold", [45, 106, 79])
  doc.setFont("courier", "normal")
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  code.split("\n").forEach((ln) => {
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(ln.slice(0, 100), margin, y)
    y += 12
  })
  y += 10
  write(`Explanation (${cap(depth)})`, 14, "bold", [45, 106, 79])
  explanation.blocks.forEach((b) => {
    y += 4
    write(`${b.title}  (lines ${b.line_start}-${b.line_end})`, 11, "bold")
    write(b[depth] || b.intermediate, 10)
  })
  y += 8
  write("Complexity Analysis", 14, "bold", [45, 106, 79])
  write(explanation.overall_complexity.explanation, 10)

  doc.save("code-explanation.pdf")
}

export async function downloadOptimizationPDF({ originalCode, modifiedCode, language, report, appliedOptimizations }) {
  const { default: jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 40
  let y = margin
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2

  const writeText = (text, size, style = "normal", color = [26, 29, 35]) => {
    doc.setFont("helvetica", style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const wrapped = doc.splitTextToSize(text, maxWidth)
    wrapped.forEach((ln) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(ln, margin, y)
      y += size * 1.4
    })
  }

  // Header
  writeText("CodeExplainer Optimization Report", 20, "bold", [45, 106, 79])
  y += 6

  // Horizontal line
  doc.setDrawColor(220, 225, 230)
  doc.setLineWidth(1)
  doc.line(margin, y, pageWidth - margin, y)
  y += 20

  // Scores Summary Card
  if (y > pageHeight - margin - 80) {
    doc.addPage()
    y = margin
  }

  doc.setFillColor(248, 249, 250) // #F8F9FA
  doc.setDrawColor(45, 106, 79) // #2D6A4F
  doc.setLineWidth(1.5)
  doc.roundedRect(margin, y, maxWidth, 65, 4, 4, "FD")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(45, 106, 79)
  doc.text(`Overall Score: ${report.score}/100`, margin + 15, y + 25)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(73, 80, 87)
  const categoriesText = `Performance: ${report.categories.performance}/100  |  Readability: ${report.categories.readability}/100  |  Maintainability: ${report.categories.maintainability}/100  |  Security: ${report.categories.security}/100`
  doc.text(categoriesText, margin + 15, y + 45)
  y += 85

  // Complexity Comparison
  if (y > pageHeight - margin - 50) {
    doc.addPage()
    y = margin
  }
  writeText("Complexity Comparison", 12, "bold", [45, 106, 79])
  y += 4
  writeText(`Current complexity:   Time: ${report.currentComplexity.time}  |  Space: ${report.currentComplexity.space}`, 9.5)
  writeText(`Optimized complexity: Time: ${report.optimizedComplexity.time}  |  Space: ${report.optimizedComplexity.space}`, 9.5)
  y += 15

  // Code Block Writer
  const writeCodeBlock = (title, codeString) => {
    if (y > pageHeight - margin - 40) {
      doc.addPage()
      y = margin
    }
    writeText(title, 12, "bold", [45, 106, 79])
    y += 4

    doc.setFont("courier", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(60, 60, 60)

    const lines = codeString.split("\n")
    lines.forEach((ln) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      const wrappedLine = doc.splitTextToSize(ln, maxWidth - 20)
      wrappedLine.forEach((subLn) => {
        doc.text(subLn, margin + 10, y)
        y += 11
      })
    })
    y += 15
  }

  writeCodeBlock("Original Code", originalCode)
  writeCodeBlock("Optimized Code", modifiedCode)

  // Improvements Breakdown
  if (y > pageHeight - margin - 40) {
    doc.addPage()
    y = margin
  }
  writeText("Detailed Improvements", 14, "bold", [45, 106, 79])
  y += 8

  report.improvements.forEach((imp) => {
    const isApplied = appliedOptimizations.includes(imp.id)
    const status = isApplied ? "APPLIED" : "NOT APPLIED"

    if (y > pageHeight - margin - 80) {
      doc.addPage()
      y = margin
    }

    // Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(45, 106, 79)
    doc.text(`${imp.title} (${status})`, margin, y)
    y += 12

    // Meta details
    writeText(`Category: ${imp.category}  |  Impact: ${imp.impact} Impact  |  Benefit: ${imp.benefit}`, 9, "oblique", [73, 80, 87])
    y += 2

    // Problem description
    writeText(`Problem: ${imp.problem}`, 9.5)
    y += 2

    // Recommended Fix
    writeText("Recommended Fix:", 9.5, "bold")
    y += 4

    doc.setFont("courier", "normal")
    doc.setFontSize(8.5)
    doc.setTextColor(50, 50, 50)
    const fixLines = imp.optimizedSnippet.split("\n")
    fixLines.forEach((fln) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(fln, margin + 10, y)
      y += 11
    })
    y += 6

    // Explanation
    writeText(`Explanation: ${imp.explanation.intermediate}`, 9.5)
    if (imp.tradeoffs) {
      writeText(`Trade-offs: ${imp.tradeoffs}`, 9.5, "normal", [100, 100, 100])
    }
    y += 15 // Space between improvement cards
  })

  doc.save("code-optimization-report.pdf")
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

export function buildCommentedMarkdown({ filename, commentedCode, language, depth }) {
  const lines = []
  lines.push(`# Commented Code: ${filename || "source_code"}`)
  lines.push("")
  lines.push(`**Generated:** ${new Date().toLocaleDateString()}  `)
  lines.push(`**Language:** ${cap(language)}  `)
  lines.push(`**Comment Depth:** ${cap(depth)}`)
  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push("## Code")
  lines.push("")
  lines.push("```" + language)
  lines.push(commentedCode)
  lines.push("```")
  lines.push("")
  lines.push("## Key Concepts")
  lines.push("- **Smart Comments:** Placed strategically to explain context and logic.")
  lines.push("- **Language Rules:** Comments formatted using language-native syntax.")
  return lines.join("\n")
}

export function buildCommentedHTML({ filename, commentedCode, language, depth }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Commented Code: ${escapeHtml(filename || "source_code")}</title>
<style>
  body { font-family: Inter, system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; background:#FAF9F5; color:#3A3A35; }
  pre { background:#F3F0E2; padding:1.2rem; border-radius:8px; border: 1px solid #D8D1BE; overflow:auto; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; }
  .header { border-bottom: 2px solid #D8D1BE; padding-bottom: 1rem; margin-bottom: 1.5rem; }
  .badges span { display:inline-block; background:#FAF9F5; border: 1px solid #D8D1BE; border-radius:4px; padding:.2rem .7rem; margin-right:.4rem; font-size:.85em; font-weight: bold; }
  h1 { color:#2D6A4F; margin-bottom: 0.5rem; }
  .muted { color:#6B6B63; font-size: 0.9em; }
</style></head>
<body>
  <div class="header">
    <h1>Commented Code: ${escapeHtml(filename || "source_code")}</h1>
    <p class="muted">Generated on ${new Date().toLocaleDateString()}</p>
    <div class="badges">
      <span>Language: ${escapeHtml(cap(language))}</span>
      <span>Depth: ${escapeHtml(cap(depth))}</span>
    </div>
  </div>
  <h2>Annotated Source</h2>
  <pre><code>${escapeHtml(commentedCode)}</code></pre>
</body></html>`
}

export async function downloadCommentedPDF({ filename, commentedCode, language, depth }) {
  const { default: jsPDF } = await import("jspdf")
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const margin = 40
  let y = margin
  const pageHeight = doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2

  const write = (text, size, style = "normal", color = [58, 58, 53]) => {
    doc.setFont("helvetica", style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const wrapped = doc.splitTextToSize(text, maxWidth)
    wrapped.forEach((ln) => {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(ln, margin, y)
      y += size * 1.4
    })
  }

  write(`Commented Code: ${filename || "source_code"}`, 18, "bold", [45, 106, 79])
  y += 8
  write(`Language: ${cap(language)}    Depth: ${cap(depth)}    Generated: ${new Date().toLocaleDateString()}`, 10, "bold", [107, 107, 99])
  y += 15

  doc.setFont("courier", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(60, 60, 60)
  
  commentedCode.split("\n").forEach((ln) => {
    if (y > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
    const wrappedLine = doc.splitTextToSize(ln, maxWidth - 20)
    wrappedLine.forEach((subLn) => {
      doc.text(subLn, margin + 10, y)
      y += 11
    })
  })

  doc.save("commented-code.pdf")
}
