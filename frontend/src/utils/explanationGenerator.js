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

// ─── Dynamic generator for arbitrary user code ───────────────────────────────

function buildBlocksForLevel(code, level) {
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
    if (!line) return
    if (
      line.startsWith("//") ||
      line.startsWith("/*") ||
      line.startsWith("*") ||
      line.startsWith("#")
    )
      return

    let type = "statement"
    let title = "Execute Line"

    // Level-differentiated default texts
    const defaults = {
      beginner: `This line does something: '${line.slice(0, 60)}'.`,
      intermediate: `Executes the statement: '${line.slice(0, 80)}'.`,
      expert: `Evaluates expression with side effects: '${line.slice(0, 100)}'.`,
    }

    let displayText = defaults[level]
    let analogy = "Like carrying out a step in a set of instructions."
    let key_concepts = ["statement"]
    const variables_affected = []

    const words = line.match(/\b[a-zA-Z_]\w*\b/g) || []
    words.forEach((w) => {
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

    if (/\bclass\s+(\w+)/.test(line)) {
      const className = line.match(/\bclass\s+(\w+)/)[1]
      type = "class"
      title = `Class Definition: ${className}`
      displayText = {
        beginner: `We create a new kind of object called '${className}'. Think of it like a cookie cutter that makes objects of the same shape.`,
        intermediate: `Declares class '${className}' for data encapsulation and OOP structure. Acts as a type blueprint.`,
        expert: `Defines class '${className}' as the structural namespace and encapsulation boundary. Consider whether this should be an interface or abstract class depending on extension requirements.`,
      }[level]
      analogy = "Like a blueprint for building a specific type of machine."
      key_concepts =
        level === "beginner"
          ? ["class", "object"]
          : level === "intermediate"
          ? ["class declaration", "encapsulation", "OOP"]
          : ["class declaration", "encapsulation", "OOP", "SOLID principles", "type hierarchy"]
    } else if (
      /\b(?:function|func|fn)\b|\w+\s+\w+\s*\(/.test(line) &&
      !line.includes(";") &&
      !line.includes("=") &&
      line.includes("(")
    ) {
      const funcNameMatch =
        line.match(/\b(?:function|func|fn)\s+(\w+)/) || line.match(/(\w+)\s*\(/)
      const funcName = funcNameMatch ? funcNameMatch[1] : "method"
      type = "function"
      title = `Function: ${funcName}`
      displayText = {
        beginner: `We define a function called '${funcName}'. A function is a named set of instructions you can run whenever you need them — like pressing a button.`,
        intermediate: `Declares the function '${funcName}' with its parameter list. This is a reusable unit of logic that can be called from other parts of the code.`,
        expert: `Method declaration for '${funcName}'. Binds the function symbol, parameter types, and stack-frame layout. Check: is this pure or does it have side effects? Consider memoization if called frequently with same args.`,
      }[level]
      analogy = "Like defining a recipe you can cook multiple times."
      key_concepts =
        level === "beginner"
          ? ["function", "reuse"]
          : level === "intermediate"
          ? ["function declaration", "parameters", "reusability", "scope"]
          : ["function declaration", "call stack", "parameter binding", "pure functions", "side effects"]
    } else if (/\b(?:if|else\s+if|switch)\b/.test(line)) {
      type = "conditional"
      title = "Conditional Check"
      displayText = {
        beginner: `We check something: if the condition is true, we do one thing; if not, we might do something else. Like deciding whether to bring an umbrella based on the weather.`,
        intermediate: `Evaluates a conditional branch. Control flow is directed based on the Boolean result. This determines which code path is taken.`,
        expert: `Conditional branch instruction. Branch predictor impact should be considered for hot loops — predictable branches (always-true or always-false) are nearly free on modern CPUs. Cyclomatic complexity increases by 1.`,
      }[level]
      analogy = "Like a fork in the road — you pick one path based on a condition."
      key_concepts =
        level === "beginner"
          ? ["if-else", "decision"]
          : level === "intermediate"
          ? ["conditionals", "control flow", "boolean logic"]
          : ["branch prediction", "cyclomatic complexity", "boolean evaluation", "short-circuit evaluation"]
      branchCount++
    } else if (/\belse\b/.test(line)) {
      type = "conditional"
      title = "Else Branch"
      displayText = {
        beginner: `This runs when the 'if' above was not true. It's the fallback option — like ordering pizza if the restaurant is closed.`,
        intermediate: `Handles the alternative code path when the preceding if-condition evaluated to false.`,
        expert: `Else-branch jump target. In branch-prediction terms, the else path is typically the cold path — verify this assumption for performance-critical code.`,
      }[level]
      analogy = "Like a backup plan when your first option doesn't work."
      key_concepts =
        level === "beginner"
          ? ["else", "fallback"]
          : level === "intermediate"
          ? ["else branch", "alternative flow"]
          : ["cold path", "branch prediction", "alternative execution"]
    } else if (/\b(?:for|while|do)\b/.test(line)) {
      type = "loop"
      title = "Loop"
      displayText = {
        beginner: `We repeat a set of steps over and over until a condition stops being true. Like stirring a pot until the soup is ready.`,
        intermediate: `Initializes a loop. The iteration continues while the condition holds. Loop body executes repeatedly — ensure the termination condition will eventually be met.`,
        expert: `Loop header. Analyze termination guarantee, invariant, and potential for infinite loops under edge-case inputs. Consider loop unrolling or SIMD if this is a hot path. Time complexity contribution: typically O(n) unless bounded by a secondary constraint.`,
      }[level]
      analogy = "Like repeating a task until it's done, then stopping."
      key_concepts =
        level === "beginner"
          ? ["loop", "repeat"]
          : level === "intermediate"
          ? ["loops", "iteration", "loop condition", "termination"]
          : ["loop optimization", "termination proof", "loop invariant", "unrolling", "vectorization"]
      hasLoop = true
      branchCount++
    } else if (/\breturn\b/.test(line)) {
      type = "return"
      title = "Return Value"
      const retValMatch = line.match(/return\s+([^;]+)/)
      const retVal = retValMatch ? retValMatch[1].trim() : "nothing"
      displayText = {
        beginner: `We're done! The function hands back a result: ${retVal}. Like finishing a task and reporting back what you found.`,
        intermediate: `Returns control flow to the caller with the value '${retVal}'. This terminates the current function execution.`,
        expert: `Pops the current stack frame, writes '${retVal}' to the return register. If this is -1 (sentinel), consider whether callers handle it consistently. An Optional<T> return type would be safer in typed languages.`,
      }[level]
      analogy = "Like handing in a finished exam paper."
      key_concepts =
        level === "beginner"
          ? ["return", "output"]
          : level === "intermediate"
          ? ["return value", "function exit", "caller"]
          : ["stack frame", "return register", "sentinel value", "type safety", "Optional types"]
    } else if (
      /\b(?:let|const|var|int|double|float|String|boolean)\b.*=/.test(line) ||
      /\w+\s*(\+|-|\*|\/)?=/.test(line)
    ) {
      type = "variable"
      title = "Variable Assignment"
      const varNameMatch =
        line.match(/\b([a-zA-Z_]\w*)\s*=/) ||
        line.match(/\b(?:int|double|float|String|boolean)\s+([a-zA-Z_]\w*)\b/)
      const varName = varNameMatch ? varNameMatch[1] : "variable"
      displayText = {
        beginner: `We create a box called '${varName}' and put a value inside it. Whenever we need that value, we open the box and look.`,
        intermediate: `Assigns a value to '${varName}'. This stores data in memory that can be read or updated later in the function.`,
        expert: `Writes a value to the heap/stack binding '${varName}'. Check mutability semantics (const vs let vs var). Consider whether this binding escapes the current scope and whether it creates a closure.`,
      }[level]
      analogy = "Like labeling a jar and putting something inside it."
      key_concepts =
        level === "beginner"
          ? ["variable", "value"]
          : level === "intermediate"
          ? ["variables", "assignment", "memory", "scope"]
          : ["binding", "mutability", "closure", "stack vs heap", "escape analysis"]
    }

    blocks.push({
      id: blockCounter++,
      line_start: lineNum,
      line_end: lineNum,
      type,
      title,
      _displayText: displayText,
      // Keep all three for reference
      beginner: displayText, // will be overridden per level anyway
      intermediate: displayText,
      expert: displayText,
      analogy,
      key_concepts,
      variables_affected,
    })

    execution_steps.push({
      step: stepCounter++,
      line: lineNum,
      title,
      what: displayText,
      why: analogy,
      description: `Line ${lineNum}: ${line.slice(0, 80)}`,
      state_changes: variables_affected.reduce(
        (acc, v) => ({ ...acc, [v]: "…" }),
        {}
      ),
    })
  })

  // Complexity descriptions per level
  let timeComplexity = "O(1)"
  let spaceComplexity = "O(1)"
  let complexityExplanation = {
    beginner:
      "This code runs super fast because it doesn't need to repeat any steps — it just goes through each instruction once and is done!",
    intermediate:
      "The code executes in constant time O(1) — no loops or recursive calls, so the number of operations doesn't change regardless of input size.",
    expert:
      "O(1) time and O(1) space: the code is loop-free and performs a fixed number of operations. No heap allocations detected; variables are stack-bound.",
  }[level]

  if (hasLoop) {
    timeComplexity = "O(n)"
    complexityExplanation = {
      beginner:
        "Because this code uses a loop, it has to do more work when given a bigger list. Imagine counting items in a pile — the bigger the pile, the longer it takes!",
      intermediate:
        "The code contains a loop that runs proportional to the input size n, giving O(n) time complexity. Space remains O(1) since no extra data structures are allocated.",
      expert:
        "O(n) time complexity due to unbounded loop iteration proportional to input size. Verify termination conditions. Space is O(1) assuming no dynamic allocation inside the loop body. Potential for SIMD or early-exit optimizations.",
    }[level]
  }

  Array.from(variableSet).forEach((v, index) => {
    variables.push({
      name: v,
      type: "variable",
      value: "dynamic",
      scope: "local",
      lastChanged: index + 1,
      description: {
        beginner: `'${v}' is a named storage box that holds a value used in this code.`,
        intermediate: `'${v}' is a local variable that stores an intermediate or final value used by the algorithm.`,
        expert: `'${v}' — local binding. Analyze escape behavior, mutability, and whether its type could be narrowed for better optimization.`,
      }[level],
    })
  })

  // Diagrams
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
      const cleanName = b.title.replace("Function: ", "").replace(/[^a-zA-Z0-9]/g, "")
      classDiagram += `    +${cleanName}() void\n`
    }
  })
  classDiagram += "  }\n"

  const summaryByLevel = {
    beginner: `This program has ${lines.length} lines. It has ${blocks.filter((b) => b.type === "function").length} function(s) and ${blocks.filter((b) => b.type === "loop").length} loop(s). Think of the functions as special helpers that do specific jobs, and the loops as tasks that repeat until they're done.`,
    intermediate: `This program consists of ${lines.length} lines. It declares ${blocks.filter((b) => b.type === "function").length} function(s), contains ${blocks.filter((b) => b.type === "conditional").length} conditional branch(es), and ${blocks.filter((b) => b.type === "loop").length} loop(s). Overall control flow follows a ${hasLoop ? "linear iterative" : "sequential"} execution model.`,
    expert: `${lines.length}-line program with ${blocks.filter((b) => b.type === "function").length} function(s), cyclomatic complexity ${1 + branchCount}, and ${blocks.filter((b) => b.type === "loop").length} loop construct(s). ${hasLoop ? "Iterative execution with O(n) time bound." : "Straight-line execution, O(1) time."} Review edge cases, null-safety, and potential for abstraction or generics.`,
  }

  return {
    summary: summaryByLevel[level],
    difficulty:
      level === "beginner" ? "beginner" : level === "intermediate" ? "intermediate" : "expert",
    estimatedReadMinutes: Math.max(
      1,
      level === "beginner"
        ? Math.ceil(lines.length / 10)
        : level === "intermediate"
        ? Math.ceil(lines.length / 7)
        : Math.ceil(lines.length / 5)
    ),
    blocks,
    overall_complexity: {
      time: timeComplexity,
      space: spaceComplexity,
      cyclomatic: 1 + branchCount,
      explanation: complexityExplanation,
      comparison: {
        beginner: "This is already a good approach for getting things done!",
        intermediate:
          "Dynamic analysis generated. For comparison, a brute-force approach would likely be less efficient.",
        expert:
          "Static analysis only — profile in production to validate actual hot paths. Asymptotic complexity may differ from practical performance due to cache effects.",
      }[level],
      breakdown: [{ name: "Control Flow", time: timeComplexity, space: spaceComplexity }],
      optimization: {
        beginner: "Great job keeping it simple! Try to reuse code by putting repeated actions into functions.",
        intermediate:
          "Ensure loops terminate early where possible. Consider caching repeated computations.",
        expert:
          "Profile before optimizing. Consider loop unrolling, memoization, SIMD, and algorithm-level improvements before micro-optimizations.",
      }[level],
    },
    patterns_detected: hasLoop ? ["loop iteration", "sequential execution"] : ["sequential execution"],
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
