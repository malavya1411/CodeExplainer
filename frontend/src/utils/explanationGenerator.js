import { defaultCode, mockExplanation } from "../data/mockExplanation.js"

// ─── Level-specific mock explanations for the default binary-search sample ───

const mockBeginner = {
  ...mockExplanation,
  summary:
    "This code is like a guessing game! Imagine you're looking for a friend's name in a phone book. Instead of reading every name from the start, you open to the middle. If your friend's name comes before the middle, you look in the left half. Otherwise, you look in the right half. You keep doing this until you find the name. This code does exactly that — it's called Binary Search.",
  difficulty: "beginner",
  estimatedReadMinutes: 2,
  patterns_detected: ["binary search", "divide and conquer"],
  overall_complexity: {
    ...mockExplanation.overall_complexity,
    explanation:
      "Think of it like this: if you have 8 pages to search, you only need to look at most 3 times (8 → 4 → 2 → 1). So if the list doubles in size, you only need one extra step. That's why it's super fast!",
    comparison: "Much faster than reading every item one by one (which would be a linear search).",
    optimization: "This is already a great approach for beginners! No changes needed.",
  },
  blocks: mockExplanation.blocks.map((b) => ({
    ...b,
    _displayText: b.beginner,
    key_concepts: b.key_concepts.slice(0, 2),
  })),
  execution_steps: mockExplanation.execution_steps.map((s) => ({
    ...s,
    what: s.why, // Use simpler "why" text as the main content for beginners
    why: "This helps us find the answer step by step, just like solving a puzzle.",
  })),
  variables: mockExplanation.variables.map((v) => ({
    ...v,
    description:
      v.name === "left"
        ? "A bookmark at the start of where we're looking"
        : v.name === "right"
        ? "A bookmark at the end of where we're looking"
        : v.name === "mid"
        ? "The middle point we check each time"
        : v.name === "target"
        ? "The number we're trying to find"
        : "The list of numbers we search through",
  })),
}

const mockIntermediate = {
  ...mockExplanation,
  summary:
    "This function implements the classic Binary Search algorithm on a sorted integer array. It maintains two pointers — left and right — that define an inclusive search window. At each iteration, the midpoint is computed, and the search space is halved by moving the appropriate pointer. The algorithm runs in O(log n) time with O(1) auxiliary space.",
  difficulty: "intermediate",
  estimatedReadMinutes: 3,
  patterns_detected: ["binary search", "two pointers", "divide and conquer"],
  overall_complexity: {
    ...mockExplanation.overall_complexity,
    explanation:
      "Each iteration halves the search space, so the loop runs at most ⌊log₂(n)⌋ + 1 times. Only three integer variables (left, right, mid) are maintained regardless of input size, giving O(1) space. Cyclomatic complexity is 4 due to the while condition, two if/else if branches.",
    comparison:
      "Binary search is significantly more efficient than a linear O(n) scan, especially for large inputs. Sorting first would cost O(n log n), making it worthwhile only when many repeated lookups are performed.",
    optimization:
      "If multiple lookups are needed on a static dataset, consider a hash set for O(1) average membership checks, at the cost of O(n) space.",
  },
  blocks: mockExplanation.blocks.map((b) => ({
    ...b,
    _displayText: b.intermediate,
  })),
  execution_steps: mockExplanation.execution_steps,
  variables: mockExplanation.variables,
}

const mockExpert = {
  ...mockExplanation,
  summary:
    "A textbook iterative binary search implementation operating on a sorted integer array with O(log n) worst-case time complexity and O(1) space. The loop invariant guarantees: if target ∈ nums, then nums[left] ≤ target ≤ nums[right] at every iteration entry. Notable: the midpoint computation `Math.floor((left + right) / 2)` is safe in JavaScript due to 64-bit floating-point semantics, but would overflow in C++/Java for large indices — the idiom `left + ((right - left) >> 1)` should be preferred in statically typed languages. The function uses −1 as a sentinel return rather than an Optional/Maybe type, which can mask misuse at the call site.",
  difficulty: "expert",
  estimatedReadMinutes: 5,
  patterns_detected: [
    "binary search",
    "two pointers",
    "divide and conquer",
    "loop invariant",
    "sentinel return",
  ],
  overall_complexity: {
    time: "O(log n)",
    space: "O(1)",
    cyclomatic: 4,
    explanation:
      "Loop invariant: target ∈ nums ⟹ ∃ i ∈ [left, right] such that nums[i] = target. Each iteration strictly narrows [left, right] by at least 1, ensuring termination in ⌊log₂(n)⌋ + 1 steps. Register-level space is constant: 3 integer bindings on the stack frame independent of n.",
    comparison:
      "Optimal for sorted-array membership queries. Hash-based structures achieve O(1) amortized at the cost of O(n) space and cache-unfriendly access patterns. B-tree indexes are preferable for range queries in database contexts.",
    breakdown: [
      { name: "Pointer initialization", time: "O(1)", space: "O(1)" },
      { name: "While condition + midpoint", time: "O(log n)", space: "O(1)" },
      { name: "Branch comparisons", time: "O(log n)", space: "O(1)" },
      { name: "Return statement", time: "O(1)", space: "O(1)" },
    ],
    optimization:
      "For production: (1) Use `left + ((right - left) >> 1)` for language-agnostic overflow safety. (2) Return ~left (bitwise NOT) as insertion index to support lower_bound semantics. (3) SIMD-based vectorized search can outperform binary search for small n ≤ 64 on modern CPUs due to branch misprediction costs. (4) Consider Eytzinger layout for cache-oblivious performance on large arrays.",
  },
  blocks: mockExplanation.blocks.map((b) => ({
    ...b,
    _displayText: b.expert,
  })),
  execution_steps: mockExplanation.execution_steps.map((s) => ({
    ...s,
    what: s.what,
    why: `Maintains loop invariant. ${s.why}`,
  })),
  variables: mockExplanation.variables.map((v) => ({
    ...v,
    description:
      v.name === "left"
        ? "Lower bound of the active search window [left, right]. Invariant: left ≤ target_index when target exists."
        : v.name === "right"
        ? "Upper bound of the active search window. Invariant: right ≥ target_index when target exists."
        : v.name === "mid"
        ? "Midpoint probe index. Computed as ⌊(left+right)/2⌋. Safe in JS (float64), unsafe in 32-bit integer languages."
        : v.name === "target"
        ? "Search key. Could be a generic Comparable<T> in a type-safe implementation."
        : "Input array. Must be sorted in ascending order — precondition not validated by this function.",
  })),
}

function parseLogicalBlocks(code, language) {
  const lines = code.split("\n")
  const cleaned = lines.map(l => l.trim())
  const blocks = []
  
  const isPython = language === "python" || (code.includes("def ") && !code.includes("{"))
  
  const findEndIndex = (startIdx) => {
    if (isPython) {
      const startLine = lines[startIdx]
      const startIndent = startLine.match(/^\s*/)[0].length
      for (let i = startIdx + 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue
        if (lines[i].trim().startsWith("#")) continue
        const indent = lines[i].match(/^\s*/)[0].length
        if (indent <= startIndent) return i - 1
      }
      return lines.length - 1
    } else {
      let braceCount = 0
      let foundOpen = false
      for (let i = startIdx; i < lines.length; i++) {
        const line = cleaned[i]
        const openMatches = (line.match(/\{/g) || []).length
        const closeMatches = (line.match(/\}/g) || []).length
        if (openMatches > 0) foundOpen = true
        braceCount += openMatches - closeMatches
        if (foundOpen && braceCount <= 0) return i
      }
      return lines.length - 1
    }
  }

  const findConditionalChainEnd = (startIdx) => {
    let currentEnd = findEndIndex(startIdx)
    while (currentEnd + 1 < lines.length) {
      const nextLine = cleaned[currentEnd + 1]
      if (nextLine.startsWith("else") || nextLine.startsWith("} else")) {
        currentEnd = findEndIndex(currentEnd + 1)
      } else {
        break
      }
    }
    return currentEnd
  }

  let i = 0
  while (i < lines.length) {
    const line = cleaned[i]
    if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*") || line.startsWith("#")) {
      i++
      continue
    }

    if (/\bclass\s+(\w+)/.test(line)) {
      const end = findEndIndex(i)
      const className = line.match(/\bclass\s+(\w+)/)[1]
      blocks.push({
        type: "class",
        title: `Class Definition: ${className}`,
        start: i + 1,
        end: end + 1
      })
      i++
    } else if (
      /\b(?:function|func|fn)\b|\w+\s+\w+\s*\(/.test(line) &&
      !line.includes(";") &&
      !line.includes("=") &&
      line.includes("(") ||
      (isPython && line.startsWith("def "))
    ) {
      const end = findEndIndex(i)
      const funcNameMatch = line.match(/\b(?:function|func|fn|def)\s+(\w+)/) || line.match(/(\w+)\s*\(/)
      const funcName = funcNameMatch ? funcNameMatch[1] : "Function"
      blocks.push({
        type: "function",
        title: `Function Definition: ${funcName}`,
        start: i + 1,
        end: end + 1
      })
      i++
    } else if (/\b(?:for|while|do)\b/.test(line)) {
      const end = findEndIndex(i)
      blocks.push({
        type: "loop",
        title: line.includes("while") ? "Binary Search Loop" : "Iteration Loop",
        start: i + 1,
        end: end + 1
      })
      i++
    } else if (/\b(?:if)\b/.test(line)) {
      const end = findConditionalChainEnd(i)
      blocks.push({
        type: "conditional",
        title: "Decision Logic",
        start: i + 1,
        end: end + 1
      })
      i = end + 1
    } else if (/\breturn\b/.test(line)) {
      blocks.push({
        type: "return",
        title: "Failure Case",
        start: i + 1,
        end: i + 1
      })
      i++
    } else if (
      /\b(?:let|const|var|int|double|float|String|boolean)\b.*=/.test(line) ||
      /\w+\s*(\+|-|\*|\/)?=/.test(line)
    ) {
      let start = i
      let end = i
      while (end + 1 < lines.length) {
        const nextLine = cleaned[end + 1]
        if (
          /\b(?:let|const|var|int|double|float|String|boolean)\b.*=/.test(nextLine) ||
          /\w+\s*(\+|-|\*|\/)?=/.test(nextLine)
        ) {
          end++
        } else {
          break
        }
      }
      blocks.push({
        type: "variable",
        title: start === end ? "Midpoint Calculation" : "Variable Initialization",
        start: start + 1,
        end: end + 1
      })
      i = end + 1
    } else {
      i++
    }
  }

  const uniqueBlocks = []
  const seen = new Set()
  blocks.forEach(b => {
    const key = `${b.start}-${b.end}-${b.type}`
    if (!seen.has(key)) {
      seen.add(key)
      uniqueBlocks.push(b)
    }
  })

  return uniqueBlocks
}

function getDynamicExplanationForBlock(b, text, variables, level) {
  let beginner = ""
  let intermediate = ""
  let expert = ""
  let analogy = ""
  let key_concepts = []

  const varNames = variables.slice(0, 3).join(", ")

  if (b.type === "function") {
    const funcName = text.match(/\b(?:function|def|func|fn)\s+(\w+)/)?.[1] || "search"
    beginner = `We define a function called '${funcName}'. A function is a named set of instructions you can run whenever you need them — like pressing a button.`
    intermediate = `Declares the function '${funcName}' with its parameters. This is a reusable unit of logic that can be invoked from other components.`
    expert = `Method signature definition for '${funcName}'. Binds parameters and sets up the stack frame context. Ensure preconditions are validated by caller.`
    analogy = "Like defining a recipe you can cook multiple times."
    key_concepts = ["function definition", "reusability"]
  } else if (b.type === "class") {
    const className = text.match(/\bclass\s+(\w+)/)?.[1] || "Class"
    beginner = `We define a class called '${className}'. Think of a class as a blueprint or cookie cutter used to create objects of the same shape.`
    intermediate = `Declares class '${className}' for data encapsulation and object-oriented structure. Acts as a type blueprint.`
    expert = `Defines class '${className}' as the structural namespace and encapsulation boundary. Consider interface segregation.`
    analogy = "Like a blueprint for building a specific type of machine."
    key_concepts = ["class", "OOP", "encapsulation"]
  } else if (b.type === "loop") {
    beginner = `This is a loop. It keeps repeating a set of steps over and over until a specific condition stops being true.`
    intermediate = `Initializes a loop structure. The body executes repeatedly while the condition holds true. Ensure the termination condition is met.`
    expert = `Loop header. Analyze termination guarantee, invariant, and potential for infinite loop states. Consider loop unrolling if performance-critical.`
    analogy = "Like repeating a task until it's done, then stopping."
    key_concepts = ["looping", "iteration", "termination"]
  } else if (b.type === "conditional") {
    beginner = `This block acts like a fork in the road. Depending on the result of the comparison, the algorithm chooses which direction to continue.`
    intermediate = `Evaluates a conditional branch. Control flow is directed to one of the branches based on the Boolean outcome.`
    expert = `Conditional branch instruction. Consider branch predictor impact for hot loops — predictable branches are nearly free on modern CPUs.`
    analogy = "Like choosing a path at a junction based on weather conditions."
    key_concepts = ["conditional logic", "branching", "control flow"]
  } else if (b.type === "return") {
    const retVal = text.match(/return\s+([^;]+)/)?.[1]?.trim() || "nothing"
    beginner = `We're done! The function exits and hands back the result: ${retVal}.`
    intermediate = `Returns control flow to the caller with the value '${retVal}', terminating this function's execution.`
    expert = `Pops the current stack frame, writing '${retVal}' to the return register. If this is a sentinel value (e.g. -1), ensure caller handles it.`
    analogy = "Like handing in a finished exam paper."
    key_concepts = ["return statement", "exit point"]
  } else if (b.type === "variable") {
    beginner = `We set up variables (${varNames || "bounds"}) to act as storage boxes. We can store data here and check it later.`
    intermediate = `Initializes state variables (${varNames || "bounds"}) to hold local values needed for calculations.`
    expert = `Stack-bound bindings created for variables (${varNames || "bounds"}). Analyze mutability (const vs let vs var) and escape behavior.`
    analogy = "Like labeling a jar and putting something inside it."
    key_concepts = ["variables", "state initialization"]
  } else {
    beginner = `This statement performs an action or calculation.`
    intermediate = `Executes a standard statement.`
    expert = `Evaluates expression with potential side effects.`
    analogy = "Like carrying out a step in a set of instructions."
    key_concepts = ["statement execution"]
  }

  if (b.type === "variable" && text.includes("mid")) {
    beginner = "We find the middle item of our current search range. By checking the middle item, we can instantly throw away half of the remaining items!"
    intermediate = "Calculates the midpoint index: Math.floor((left + right) / 2). This divides the current search range into two equal parts."
    expert = "Computes the probe index mid using index arithmetic. Note: (left + right) / 2 can overflow in C++/Java. Safe alternative: left + ((right - left) >> 1)."
    analogy = "Like opening a dictionary exactly in the middle."
    key_concepts = ["midpoint calculation", "divide and conquer"]
  }

  return { beginner, intermediate, expert, analogy, key_concepts }
}

function buildBlocksForLevel(code, level) {
  const lines = code.split("\n")
  const extractedBlocks = parseLogicalBlocks(code, "javascript")

  let blockCounter = 1
  let branchCount = 0
  let hasLoop = false
  const variableSet = new Set()

  const blocks = extractedBlocks.map((b) => {
    const blockLines = lines.slice(b.start - 1, b.end)
    const variables_affected = []

    blockLines.forEach(l => {
      const words = l.trim().match(/\b[a-zA-Z_]\w*\b/g) || []
      words.forEach(w => {
        const keywords = [
          "function","class","public","private","protected","int","double","float",
          "boolean","char","void","return","if","else","for","while","const","let",
          "var","static","new","import","package","System","out","println","length",
          "search","target","nums","i","Solution","null","true","false",
        ]
        if (!keywords.includes(w) && w.length > 1) {
          variableSet.add(w)
          variables_affected.push(w)
        }
      })
    })

    if (b.type === "loop") hasLoop = true
    if (b.type === "conditional") branchCount++

    const { beginner, intermediate, expert, analogy, key_concepts } = getDynamicExplanationForBlock(b, blockLines.join(" "), variables_affected, level)
    const displayText = { beginner, intermediate, expert }[level]

    return {
      id: blockCounter++,
      line_start: b.start,
      line_end: b.end,
      type: b.type,
      title: b.title,
      beginner,
      intermediate,
      expert,
      _displayText: displayText,
      analogy,
      key_concepts,
      variables_affected: Array.from(new Set(variables_affected)),
    }
  })

  const execution_steps = blocks.map((b, idx) => ({
    step: idx + 1,
    line: b.line_start,
    title: b.title,
    what: b._displayText,
    why: b.analogy,
    description: `${b.title} (Lines ${b.line_start}-${b.line_end})`,
    state_changes: b.variables_affected.reduce(
      (acc, v) => ({ ...acc, [v]: "…" }),
      {}
    )
  }))

  const potential_issues = []
  if (code.includes("Math.floor((left + right) / 2)")) {
    potential_issues.push({
      severity: "warning",
      line: lines.findIndex(l => l.includes("Math.floor((left + right) / 2)")) + 1,
      description: "Integer overflow possible in statically typed languages with (left + right) / 2.",
      suggestion: "Use left + (right - left) / 2 for overflow-safe arithmetic."
    })
  }

  let timeComplexity = "O(1)"
  let spaceComplexity = "O(1)"
  let complexityExplanation = {
    beginner: "This code runs super fast because it doesn't need to repeat any steps — it just goes through each instruction once and is done!",
    intermediate: "The code executes in constant time O(1) — no loops or recursive calls, so the number of operations doesn't change regardless of input size.",
    expert: "O(1) time and O(1) space: the code is loop-free and performs a fixed number of operations. No heap allocations detected; variables are stack-bound.",
  }[level]

  if (hasLoop) {
    timeComplexity = "O(log n)"
    const isBinarySearch = code.includes("mid") && code.includes("left") && code.includes("right")
    if (!isBinarySearch) {
      timeComplexity = "O(n)"
    }
    complexityExplanation = isBinarySearch 
      ? {
          beginner: "Each step cuts our search space in half. Think of searching a phone book: by opening to the middle, you discard half the pages each time. It takes very few steps even for huge lists!",
          intermediate: "O(log n) time complexity. The search window is halved during each iteration, yielding logarithmic runtime efficiency.",
          expert: "Logarithmic time O(log n). Each iteration reduces the search bounds [left, right] to half its current size, satisfying worst-case recursion T(n) = T(n/2) + O(1)."
        }[level]
      : {
          beginner: "Because this code uses a loop, it has to do more work when given a bigger list. The execution time increases linearly.",
          intermediate: "The code contains a loop that runs proportional to the input size n, giving O(n) time complexity.",
          expert: "O(n) time complexity due to loop iteration proportional to input size. Space is O(1) assuming no dynamic allocation.",
        }[level]
  }

  const variables = []
  Array.from(variableSet).forEach((v, index) => {
    variables.push({
      name: v,
      type: v === "nums" ? "number[]" : "number",
      value: v === "nums" ? "[1, 3, 5, 7, 9]" : "dynamic",
      scope: v === "nums" || v === "target" ? "parameter" : "local",
      lastChanged: index + 1,
      description: {
        beginner: `'${v}' is a named storage box that holds a value used in this code.`,
        intermediate: `'${v}' is a local variable that stores an intermediate or final value used by the algorithm.`,
        expert: `'${v}' — local binding. mutability and escape analysis.`,
      }[level],
    })
  })

  let flowchart = "flowchart TD\n  Start([Start]) --> Step1\n"
  execution_steps.forEach((s) => {
    const sanitised = s.title.replace(/[^a-zA-Z0-9 ]/g, "")
    flowchart += `  Step${s.step}["Step ${s.step}: ${sanitised}"]\n`
    if (s.step < execution_steps.length) {
      flowchart += `  Step${s.step} --> Step${s.step + 1}\n`
    } else {
      flowchart += `  Step${s.step} --> End([End])\n`
    }
  })

  let sequence = "sequenceDiagram\n  participant User\n  participant CodeExplainer\n  User->>CodeExplainer: Run execution flow\n"
  execution_steps.forEach((s) => {
    const sanitised = s.title.replace(/[^a-zA-Z0-9 ]/g, "")
    sequence += `  CodeExplainer->>CodeExplainer: Line ${s.line} (${sanitised})\n`
  })
  sequence += "  CodeExplainer-->>User: Execution complete\n"

  let classDiagram = "classDiagram\n  class CodeExplainerProgram {\n"
  blocks.forEach((b) => {
    if (b.type === "function") {
      const cleanName = b.title.replace("Function Definition: ", "").replace(/[^a-zA-Z0-9]/g, "")
      classDiagram += `    +${cleanName}() void\n`
    }
  })
  classDiagram += "  }\n"

  const summaryByLevel = {
    beginner: `This program has ${lines.length} lines. It contains ${blocks.length} logical blocks: ${blocks.map(b => b.title).join(", ")}. These blocks split the code into logical phases to make it easy to learn.`,
    intermediate: `This program consists of ${lines.length} lines, structured into ${blocks.length} logical components. The routine utilizes variable initialization, control loops, and conditionals to process input.`,
    expert: `${lines.length}-line program parsed into ${blocks.length} logical control flows. Cyclomatic complexity is ${1 + branchCount}. Analysis covers loop invariants, index arithmetic safety, and performance constraints.`,
  }

  return {
    summary: summaryByLevel[level],
    difficulty: level === "beginner" ? "beginner" : level === "intermediate" ? "intermediate" : "expert",
    estimatedReadMinutes: Math.max(1, Math.ceil(lines.length / 7)),
    blocks,
    overall_complexity: {
      time: timeComplexity,
      space: spaceComplexity,
      cyclomatic: 1 + branchCount,
      explanation: complexityExplanation,
      comparison: {
        beginner: "This is already a very efficient approach!",
        intermediate: "Logarithmic lookup is optimal for static sorted lists. Brute force would cost linear time O(n).",
        expert: "Time is O(log n), space is O(1). Hash index search can achieve O(1) time but requires O(n) auxiliary space.",
      }[level],
      breakdown: blocks.map(b => ({
        name: b.title,
        time: b.type === "loop" || b.type === "conditional" ? "O(log n)" : "O(1)",
        space: "O(1)"
      })),
      optimization: {
        beginner: "Great job keeping it simple! Try to reuse code by putting repeated actions into functions.",
        intermediate: "Ensure loop bounds terminate early. Overflow safety check is recommended.",
        expert: "Profile branch predictor misses. Consider bitwise shifts for midpoint computation.",
      }[level],
    },
    patterns_detected: hasLoop ? ["loop iteration", "binary search window"] : ["sequential flow"],
    potential_issues,
    execution_steps,
    variables,
    diagrams: { flowchart, sequence, classDiagram },
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate explanations for all three depth levels.
 * Returns { beginner, intermediate, expert }.
 */
export function generateAllExplanations(code, language) {
  const isDefault = code.trim() === defaultCode.trim()

  if (isDefault) {
    return {
      beginner: mockBeginner,
      intermediate: mockIntermediate,
      expert: mockExpert,
    }
  }

  return {
    beginner: buildBlocksForLevel(code, "beginner"),
    intermediate: buildBlocksForLevel(code, "intermediate"),
    expert: buildBlocksForLevel(code, "expert"),
  }
}

/**
 * Legacy single-level generator — kept for backwards compat if needed.
 */
export function generateDynamicExplanation(code, language) {
  const isDefault = code.trim() === defaultCode.trim()
  return isDefault ? mockExplanation : buildBlocksForLevel(code, "intermediate")
}
