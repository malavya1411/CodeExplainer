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
      line_end: 1,
      type: "function",
      title: "Function Definition",
      beginner:
        "We create a function called 'search' that looks for a number (the target) inside a list of numbers (nums).",
      intermediate:
        "Defines a function 'search' that takes a sorted array 'nums' and a 'target' value to locate within it.",
      expert:
        "Function signature accepts an array and a target. For production code consider a generic type T extends Comparable so the routine works on any orderable type.",
      analogy: "Like a librarian who finds a book using an ordered catalog system.",
      key_concepts: ["function definition", "parameters"],
      variables_affected: ["nums", "target"],
    },
    {
      id: 2,
      line_start: 2,
      line_end: 3,
      type: "variable",
      title: "Initialize Pointers",
      beginner: "We set two markers: one at the start of the list and one at the end.",
      intermediate: "Initialize 'left' and 'right' pointers to define the inclusive search boundaries.",
      expert:
        "Two-pointer technique with left=0, right=length-1. Loop invariant: if target exists it lies within [left, right].",
      analogy: "Like placing bookmarks at the first and last page of a book.",
      key_concepts: ["two pointers", "initialization"],
      variables_affected: ["left", "right"],
    },
    {
      id: 3,
      line_start: 5,
      line_end: 14,
      type: "loop",
      title: "Binary Search Loop",
      beginner:
        "We keep looking at the middle item and throwing away the half that can't contain our number.",
      intermediate:
        "A while loop continues while the search space is valid. It computes the midpoint, compares it to the target, and moves the appropriate pointer.",
      expert:
        "Iterative binary search in O(log n). Note: in C++/Java use left + (right - left) / 2 to avoid integer overflow on large indices.",
      analogy:
        "Like finding a word in a dictionary by opening to the middle and deciding which half to keep.",
      key_concepts: ["binary search", "while loop", "divide and conquer"],
      variables_affected: ["left", "right", "mid"],
    },
    {
      id: 4,
      line_start: 15,
      line_end: 15,
      type: "return",
      title: "Not Found",
      beginner: "If we never found the number, we return -1 to say 'it isn't here'.",
      intermediate: "Returns -1 as a sentinel value indicating the target is absent from the array.",
      expert:
        "Returning -1 is conventional. Some APIs prefer returning the insertion point (~index) to support lower_bound semantics.",
      analogy: "Like reporting 'no such book' after checking the whole catalog.",
      key_concepts: ["sentinel value", "return"],
      variables_affected: [],
    },
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
      title: "Call function",
      what: "search is invoked with the input array and target.",
      why: "This sets up the problem we are solving.",
      description: "Function called with nums=[1,3,5,7,9], target=5",
      state_changes: { nums: "[1,3,5,7,9]", target: "5" },
    },
    {
      step: 2,
      line: 2,
      title: "Initialize left",
      what: "left is set to the first index, 0.",
      why: "left marks the lower bound of where the target could be.",
      description: "Initialize left pointer to 0",
      state_changes: { left: "0" },
    },
    {
      step: 3,
      line: 3,
      title: "Initialize right",
      what: "right is set to the last index, 4.",
      why: "right marks the upper bound of the search window.",
      description: "Initialize right pointer to 4 (last index)",
      state_changes: { right: "4" },
    },
    {
      step: 4,
      line: 6,
      title: "Compute midpoint",
      what: "mid = floor((0 + 4) / 2) = 2.",
      why: "We always probe the middle to discard half the range.",
      description: "Calculate middle index: (0+4)/2 = 2",
      state_changes: { mid: "2" },
    },
    {
      step: 5,
      line: 7,
      title: "Compare with target",
      what: "Check whether nums[2] (=5) equals target (=5).",
      why: "If the midpoint matches we are done.",
      description: "Check if nums[2]=5 equals target=5",
      state_changes: {},
    },
    {
      step: 6,
      line: 8,
      title: "Match found",
      what: "nums[2] equals the target, so return index 2.",
      why: "Binary search succeeds in log n steps.",
      description: "Match found! Return index 2",
      state_changes: { return: "2" },
    },
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
