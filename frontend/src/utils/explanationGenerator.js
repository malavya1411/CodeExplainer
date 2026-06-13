import { defaultCode, mockExplanation } from "../data/mockExplanation.js"

export function generateDynamicExplanation(code, language) {
  // If it matches defaultCode exactly, return the pre-configured mock explanation
  if (code.trim() === defaultCode.trim()) {
    return mockExplanation
  }

  const lines = code.split("\n")
  const blocks = []
  const execution_steps = []
  const variables = []
  const potential_issues = []
  const patterns_detected = []

  let stepCounter = 1
  let blockCounter = 1
  let branchCount = 0
  let hasLoop = false
  const variableSet = new Set()

  lines.forEach((originalLine, index) => {
    const lineNum = index + 1
    const line = originalLine.trim()
    if (!line) return // Skip empty lines
    if (line.startsWith("//") || line.startsWith("/*") || line.startsWith("*") || line.startsWith("#")) {
      return // Skip comments
    }

    // Default values
    let type = "statement"
    let title = "Execute Line"
    let beginner = `We run this line: '${line}'`
    let intermediate = `Executes the statement: '${line}'`
    let expert = `Evaluates expression: '${line}'`
    let analogy = "Like carrying out a specific step in a recipe instructions."
    let key_concepts = ["statement"]
    const variables_affected = []

    // Variable heuristics extraction
    const words = line.match(/\b[a-zA-Z_]\w*\b/g) || []
    words.forEach((w) => {
      const keywords = [
        "function", "class", "public", "private", "protected", "int", "double", "float", 
        "boolean", "char", "void", "return", "if", "else", "for", "while", "const", "let", 
        "var", "static", "new", "import", "package", "System", "out", "println", "length", 
        "search", "target", "nums", "i", "Solution", "null", "true", "false"
      ]
      if (!keywords.includes(w) && w.length > 1) {
        variableSet.add(w)
        variables_affected.push(w)
      }
    })

    if (/\bclass\s+(\w+)/.test(line)) {
      const className = line.match(/\bclass\s+(\w+)/)[1]
      type = "class"
      title = `Class Definition: ${className}`
      beginner = `Defines a new class structure named '${className}' that bundles variables and functions.`
      intermediate = `Declares the class '${className}' for data encapsulation and object construction.`
      expert = `Defines class '${className}'. Acts as the structural namespace and OOP encapsulation unit.`
      analogy = "Like a blueprint for building a specific type of machine."
      key_concepts = ["class declaration", "encapsulation"]
    } else if (/\b(?:function|func|fn)\b|\w+\s+\w+\s*\(/.test(line) && !line.includes(";") && !line.includes("=") && line.includes("(")) {
      const funcNameMatch = line.match(/\b(?:function|func|fn)\s+(\w+)/) || line.match(/(\w+)\s*\(/)
      const funcName = funcNameMatch ? funcNameMatch[1] : "method"
      type = "function"
      title = `Method Definition: ${funcName}`
      beginner = `Declares a function/method named '${funcName}' which is a reusable pack of instructions.`
      intermediate = `Defines the functional unit/method '${funcName}' with its parameter list.`
      expert = `Method declaration for '${funcName}'. Binds the method symbol, parameters, and stack-frame layout.`
      analogy = "Like defining a button on a remote control that performs a specific action."
      key_concepts = ["method declaration", "reusability"]
    } else if (/\b(?:if|else\s+if|switch)\b/.test(line)) {
      type = "conditional"
      title = "Conditional check"
      beginner = `We check a condition: if it holds, we run the nested instructions; otherwise, we skip them.`
      intermediate = `Evaluates conditional logic branch criteria.`
      expert = `Conditional branch instruction. Directs stack execution pointer based on Boolean evaluation.`
      analogy = "Like checking if it is raining outside before choosing whether to take an umbrella."
      key_concepts = ["conditionals", "logical branch"]
      branchCount++
    } else if (/\belse\b/.test(line)) {
      type = "conditional"
      title = "Alternative Branch (Else)"
      beginner = `Fallback path: executes because the previous 'if' conditions were not satisfied.`
      intermediate = `Handles alternative branch routing for the conditional group.`
      expert = `Else fallback jump marker. Directs flow when zero conditional matches evaluate to true.`
      analogy = "Like order a side dish because your first choice was sold out."
      key_concepts = ["alternative flow"]
    } else if (/\b(?:for|while|do)\b/.test(line)) {
      type = "loop"
      title = "Loop Iteration"
      beginner = `We start a loop to repeat these actions until the loop condition is finished.`
      intermediate = `Initializes/checks loop iteration criteria.`
      expert = `Loop iteration head. Computes boundary constraint checking before block entry.`
      analogy = "Like repeating a song on your playlist until you get tired of it."
      key_concepts = ["loops", "iteration"]
      hasLoop = true
      branchCount++
    } else if (/\breturn\b/.test(line)) {
      type = "return"
      title = "Return Result"
      const retValMatch = line.match(/return\s+([^;]+)/)
      const retVal = retValMatch ? retValMatch[1].trim() : ""
      beginner = `We exit this function and send back the result${retVal ? ": " + retVal : "."}`
      intermediate = `Returns control and output value '${retVal || "void"}' to caller.`
      expert = `Pops current call-stack frame, pushing return registry value '${retVal || "void"}'.`
      analogy = "Like hand-delivering the completed report to your manager."
      key_concepts = ["function return", "stack cleanup"]
    } else if (/\b(?:let|const|var|int|double|float|String|boolean)\b.*\=/.test(line) || /\w+\s*(\+|-|\*|\/)?=/.test(line)) {
      type = "variable"
      title = "Variable Assignment"
      const varNameMatch = line.match(/\b([a-zA-Z_]\w*)\s*=/) || line.match(/\b(?:int|double|float|String|boolean)\s+([a-zA-Z_]\w*)\b/)
      const varName = varNameMatch ? varNameMatch[1] : "variable"
      beginner = `We set or update the variable '${varName}' to hold a new value.`
      intermediate = `Performs write assignment to memory register for '${varName}'.`
      expert = `Writes data payload to heap/stack memory block referenced by '${varName}'.`
      analogy = "Like updating the number on a scoreboard during a game."
      key_concepts = ["variables", "assignment"]
    }

    blocks.push({
      id: blockCounter++,
      line_start: lineNum,
      line_end: lineNum,
      type,
      title,
      beginner,
      intermediate,
      expert,
      analogy,
      key_concepts,
      variables_affected
    })

    execution_steps.push({
      step: stepCounter++,
      line: lineNum,
      title: `${title}`,
      what: intermediate,
      why: beginner,
      description: `Line ${lineNum}: ${line}`,
      state_changes: variables_affected.reduce((acc, v) => ({ ...acc, [v]: "..." }), {})
    })
  })

  // Heuristics for algorithmic complexity
  let timeComplexity = "O(1)"
  let spaceComplexity = "O(1)"
  let complexityExplanation = "The code runs in constant time O(1) with O(1) auxiliary space as it executes sequentially without loops."

  if (hasLoop) {
    timeComplexity = "O(n)"
    complexityExplanation = "The code contains loops that iterate proportional to the size of the inputs, resulting in linear O(n) runtime."
  }

  // Populate dynamic variable details
  Array.from(variableSet).forEach((v, index) => {
    variables.push({
      name: v,
      type: "variable",
      value: "Dynamic",
      scope: "local",
      lastChanged: index + 1
    })
  })

  // Generate dynamic diagrams syntax
  let flowchart = "flowchart TD\n  Start([Start]) --> Step1\n"
  execution_steps.forEach((s) => {
    const sanitisedTitle = s.title.replace(/[^a-zA-Z0-9 ]/g, "")
    flowchart += `  Step${s.step}["Step ${s.step}: ${sanitisedTitle}"]\n`
    if (s.step < execution_steps.length) {
      flowchart += `  Step${s.step} --> Step${s.step + 1}\n`
    } else {
      flowchart += `  Step${s.step} --> End([End])\n`
    }
  })

  let sequence = "sequenceDiagram\n  participant User\n  participant CodeExplainer\n  User->>CodeExplainer: Run execution flow\n"
  execution_steps.forEach((s) => {
    const sanitisedTitle = s.title.replace(/[^a-zA-Z0-9 ]/g, "")
    sequence += `  CodeExplainer->>CodeExplainer: Line ${s.line} (${sanitisedTitle})\n`
  })
  sequence += "  CodeExplainer-->>User: Execution complete\n"

  let classDiagram = "classDiagram\n  class CodeExplainerProgram {\n"
  blocks.forEach((b) => {
    if (b.type === "function") {
      const cleanName = b.title.replace("Method Definition: ", "").replace(/[^a-zA-Z0-9]/g, "")
      classDiagram += `    +${cleanName}() void\n`
    }
  })
  classDiagram += "  }\n"

  return {
    summary: `This program consists of ${lines.length} lines of code. It contains ${blocks.filter(b => b.type === "function").length} functional unit(s)/method(s) and includes ${blocks.filter(b => b.type === "conditional").length} branching conditional statement(s).`,
    difficulty: lines.length > 25 ? "advanced" : (lines.length > 12 ? "intermediate" : "beginner"),
    estimatedReadMinutes: Math.max(1, Math.ceil(lines.length / 8)),
    blocks,
    overall_complexity: {
      time: timeComplexity,
      space: spaceComplexity,
      cyclomatic: 1 + branchCount,
      explanation: complexityExplanation,
      comparison: "Dynamic analysis generated based on sequential line loops and syntax tokens.",
      breakdown: [
        { name: "Control Flow", time: timeComplexity, space: spaceComplexity }
      ],
      optimization: "Ensure loops terminate early where possible to keep average time complexity lower than upper bounds."
    },
    patterns_detected: hasLoop ? ["loop iteration"] : ["sequential execution"],
    potential_issues,
    execution_steps,
    variables,
    diagrams: {
      flowchart,
      sequence,
      classDiagram
    }
  }
}
