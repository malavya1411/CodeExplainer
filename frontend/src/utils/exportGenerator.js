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

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
