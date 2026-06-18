export const defaultCode = `function search(nums, target) {
  let left = 0
  let right = nums.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return -1
}`

export const mockExplanation = {
  summary:
    "This function implements binary search to efficiently find an element in a sorted array by repeatedly halving the search range.",
  difficulty: "intermediate",
  estimatedReadMinutes: 3,
  blocks: [
    {
      id: 1,
      line_start: 1,
      line_end: 16,
      type: "function",
      title: "Function Definition",
      beginner: "We create a function search. A function is like a reusable tool or a button we can press whenever we want to find a number.",
      intermediate: "Defines the entry point search(nums, target) for the binary search routine.",
      expert: "Function signature mapping. Iterative binary search implementation on a sorted array of numbers.",
      analogy: "Like defining a recipe to bake bread.",
      key_concepts: ["function interface", "parameters"],
      variables_affected: ["nums", "target"]
    },
    {
      id: 2,
      line_start: 2,
      line_end: 3,
      type: "variable",
      title: "Search Boundary Initialization",
      beginner: "We set up our bookmarks: 'left' at page 0, and 'right' at the very last page. These mark where we'll search.",
      intermediate: "Initializes left and right pointers to define the boundaries of the active search range.",
      expert: "Pushes pointers left=0 and right=n-1 onto the stack frame to establish the initial search window bounds.",
      analogy: "Placing bookmarks at the start and end of the book.",
      key_concepts: ["initialization", "two pointers"],
      variables_affected: ["left", "right"]
    },
    {
      id: 3,
      line_start: 5,
      line_end: 14,
      type: "loop",
      title: "Binary Search Loop",
      beginner: "We keep checking the middle as long as our bookmarks haven't crossed. If they cross, the number isn't there.",
      intermediate: "Runs a while loop to repeatedly halve the search space as long as left <= right.",
      expert: "Loop construct. Invariant: target ∈ nums => target ∈ nums[left...right] at the entry of each iteration.",
      analogy: "Flipping open a dictionary and deciding which half to search.",
      key_concepts: ["iteration", "loop condition"],
      variables_affected: ["left", "right", "mid"]
    },
    {
      id: 4,
      line_start: 6,
      line_end: 6,
      type: "variable",
      title: "Midpoint Calculation",
      beginner: "We look at the exact middle page between our bookmarks to see what item is there.",
      intermediate: "Calculates the midpoint index: Math.floor((left + right) / 2).",
      expert: "Calculates the probe index mid. Note: (left + right) / 2 overflows in C++/Java. Use left + ((right - left) >> 1) in production.",
      analogy: "Opening a catalog exactly in the middle.",
      key_concepts: ["midpoint", "index arithmetic"],
      variables_affected: ["mid"]
    },
    {
      id: 5,
      line_start: 7,
      line_end: 12,
      type: "conditional",
      title: "Decision Logic",
      beginner: "This block acts like a fork in the road. Depending on the result of the comparison, the algorithm chooses which direction to continue.",
      intermediate: "Compares nums[mid] with target. Moves left or right boundary to search the appropriate half, or returns index if found.",
      expert: "Evaluates the key against target. Three-way branch: target matches (returns index), target is larger (updates left), target is smaller (updates right).",
      analogy: "A signpost at a fork in the road.",
      key_concepts: ["branching", "comparison"],
      variables_affected: ["left", "right"]
    },
    {
      id: 6,
      line_start: 15,
      line_end: 15,
      type: "return",
      title: "Failure Case",
      beginner: "If we search the entire list and find nothing, we return -1 to signal 'not found'.",
      intermediate: "Returns -1 as a sentinel value indicating the target does not exist in the array.",
      expert: "Returns sentinel -1 indicating search failure. Modern APIs might return an Option type or insertion index (~left).",
      analogy: "Checking the whole library and reporting that the book doesn't exist.",
      key_concepts: ["sentinel return", "failure state"],
      variables_affected: []
    }
  ],
  overall_complexity: {
    time: "O(log n)",
    space: "O(1)",
    cyclomatic: 4,
    explanation:
      "Each iteration halves the search space, so the loop runs at most log₂(n) times. Only a constant number of integer variables are used regardless of input size.",
    comparison: "Far better than a linear O(n) scan, and avoids the O(n log n) cost of sorting first.",
    breakdown: [
      { name: "Pointer initialization", time: "O(1)", space: "O(1)" },
      { name: "Binary search loop", time: "O(log n)", space: "O(1)" },
      { name: "Return statement", time: "O(1)", space: "O(1)" },
    ],
    optimization:
      "Already optimal for searching a sorted array. If you need many lookups, consider a hash set for O(1) average membership tests.",
  },
  patterns_detected: ["binary search", "two pointers", "divide and conquer"],
  potential_issues: [
    {
      severity: "warning",
      line: 6,
      description: "Integer overflow possible in C++/Java with (left + right) / 2.",
      suggestion: "Use left + (right - left) / 2 for language-agnostic safety.",
    },
  ],
  execution_steps: [
    {
      step: 1,
      line: 1,
      title: "Function Definition",
      what: "The search function accepts an array and a target value.",
      why: "This defines the signature and inputs for the binary search.",
      description: "Function Definition (Lines 1-16)",
      state_changes: { nums: "[1,3,5,7,9]", target: "5" }
    },
    {
      step: 2,
      line: 2,
      title: "Search Boundary Initialization",
      what: "left starts at 0, and right starts at 4.",
      why: "These pointers define the bounds of the active search range.",
      description: "Search Boundary Initialization (Lines 2-3)",
      state_changes: { left: "0", right: "4" }
    },
    {
      step: 3,
      line: 5,
      title: "Binary Search Loop",
      what: "The loop checks if the bounds are still valid (left <= right).",
      why: "If pointers cross, the search space is exhausted.",
      description: "Binary Search Loop (Lines 5-14)",
      state_changes: {}
    },
    {
      step: 4,
      line: 6,
      title: "Midpoint Calculation",
      what: "mid is calculated as 2.",
      why: "This divides the current search range into two equal halves.",
      description: "Midpoint Calculation (Line 6)",
      state_changes: { mid: "2" }
    },
    {
      step: 5,
      line: 7,
      title: "Decision Logic",
      what: "Checks if nums[mid] (5) equals target (5). Match found!",
      why: "Decides which half to keep or if the target is found.",
      description: "Decision Logic (Lines 7-12)",
      state_changes: {}
    },
    {
      step: 6,
      line: 15,
      title: "Failure Case",
      what: "If the loop finished, it would return -1.",
      why: "Handles the case where the target value is not present.",
      description: "Failure Case (Line 15)",
      state_changes: { return: "-1" }
    }
  ],
  variables: [
    { name: "nums", type: "number[]", value: "[1, 3, 5, 7, 9]", scope: "parameter", lastChanged: 1 },
    { name: "target", type: "number", value: "5", scope: "parameter", lastChanged: 1 },
    { name: "left", type: "number", value: "0", scope: "local", lastChanged: 2 },
    { name: "right", type: "number", value: "4", scope: "local", lastChanged: 3 },
    { name: "mid", type: "number", value: "2", scope: "local", lastChanged: 4 },
  ],
  diagrams: {
    flowchart: `flowchart TD
    Start([Start: search nums, target]) --> Init[left = 0, right = n-1]
    Init --> Cond{left <= right?}
    Cond -- No --> Ret[return -1]
    Cond -- Yes --> Mid[mid = left+right / 2]
    Mid --> Cmp{nums mid == target?}
    Cmp -- Yes --> Found[return mid]
    Cmp -- No --> Less{nums mid < target?}
    Less -- Yes --> Right[left = mid + 1]
    Less -- No --> Left[right = mid - 1]
    Right --> Cond
    Left --> Cond
    Ret --> End([End])
    Found --> End`,
    sequence: `sequenceDiagram
    participant Caller
    participant search
    participant Array
    Caller->>search: search nums target
    search->>Array: read nums mid
    Array-->>search: value at mid
    search->>search: compare and move pointer
    search-->>Caller: return index`,
    classDiagram: `classDiagram
    class SearchModule {
      +search(nums, target) int
      -computeMid(left, right) int
    }`,
  },
}
