export function generateCommentedCode(code, language, settings) {
  const depth = settings.depth || "intermediate";
  const { placement, style, formatting } = settings;
  const cleanCode = code.trim();

  // Helper to wrap comments to max length
  const wrap = (text, commentPrefix, isBlock = false) => {
    const max = formatting.maxLength || 80;
    const avail = max - commentPrefix.length - 2; // room for spaces
    if (text.length <= avail) {
      return isBlock ? `${commentPrefix} ${text}` : ` ${commentPrefix} ${text}`;
    }
    // Simple word wrapping
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (let word of words) {
      if ((currentLine + " " + word).trim().length <= avail) {
        currentLine = (currentLine + " " + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    if (isBlock) {
      return lines.map(l => `${commentPrefix} ${l}`).join("\n");
    } else {
      // For inline comments, wrap them as block comments above the line instead of inline if they are too long
      return lines.map(l => `\n${commentPrefix} ${l}`).join("");
    }
  };

  const isPython = language === "python" || cleanCode.includes("def ") || cleanCode.includes("import ");
  const isJava = language === "java" || cleanCode.includes("class Solution") || cleanCode.includes("public int search");
  const isCpp = language === "cpp" || cleanCode.includes("#include") || cleanCode.includes("std::");
  const isJs = !isPython && !isJava && !isCpp;

  // 1. Check for Fibonacci template
  const isFibonacci = cleanCode.includes("def fibonacci(n):") || cleanCode.includes("function fibonacci(n)") || cleanCode.includes("int fibonacci(int n)");
  if (isFibonacci) {
    if (isPython) {
      if (depth === "beginner") {
        return `# This function finds a number in the Fibonacci sequence
def fibonacci(n):
    # If n is 0 or 1, just return n (base case)
    if n < 2:
        return n
    # Otherwise, add the two previous Fibonacci numbers
    return fibonacci(n-1) + fibonacci(n-2)`;
      } else if (depth === "intermediate") {
        return `"""
Calculate nth Fibonacci number using recursion.
Args:
    n: Position in sequence (0-indexed)
Returns:
    nth Fibonacci number
Note: Inefficient for large n due to repeated calculations
Time: O(2^n), Space: O(n) call stack
"""
def fibonacci(n):
    # Base case: F(0)=0, F(1)=1
    if n < 2:
        return n
    # Recursive case: F(n) = F(n-1) + F(n-2)
    return fibonacci(n-1) + fibonacci(n-2)`;
      } else {
        return `"""
Naive recursive Fibonacci — O(2^n) time, O(n) stack space.

WARNING: Exponential time due to repeated subproblem computation.
For production use, prefer:
  - Memoization (top-down DP): O(n) time, O(n) space
  - Tabulation (bottom-up DP): O(n) time, O(n) space  
  - Space-optimized iterative: O(n) time, O(1) space
  - Matrix exponentiation: O(log n) time

Args:
    n: int — Sequence index (non-negative)
Returns:
    int — Fibonacci number F(n)
Raises:
    RecursionError: If n > 1000 (Python stack limit)
"""
def fibonacci(n):
    # Base cases: F(0)=0, F(1)=1 — recursion termination
    if n < 2:
        return n

    # Recursive decomposition: F(n) = F(n-1) + F(n-2)
    # T(n) = T(n-1) + T(n-2) + O(1) → T(n) = O(φ^n) where φ≈1.618
    return fibonacci(n-1) + fibonacci(n-2)`;
      }
    }
  }

  // 2. Check for default binary search templates
  const isBinarySearch = cleanCode.includes("search(nums, target)") || cleanCode.includes("search(int[] nums");
  if (isBinarySearch) {
    if (isJava) {
      if (depth === "beginner") {
        return `class Solution {
    // A search helper to locate items quickly
    public int search(int[] nums, int target) {
        // Stop early if array is empty or doesn't exist
        if (nums == null || nums.length == 0) {
            return -1; // Not found sentinel
        }
        int left = 0; // Lower pointer
        int right = nums.length - 1; // Upper pointer

        // Continue searching while boundaries are valid
        while (left <= right) {
            // Find the midpoint of the search space safely
            int mid = left + ((right - left) >>> 1);
            
            // Check if middle matches target
            if (nums[mid] == target) {
                return mid; // Return matched index
            } else if (nums[mid] < target) {
                left = mid + 1; // Discard left half
            } else {
                right = mid - 1; // Discard right half
            }
        }
        return -1; // Return -1 if not found
    }
}`;
      } else if (depth === "intermediate") {
        return `/**
 * Sorts/searches target key inside array using binary search.
 * @param nums - Sorted array of integers
 * @param target - Key element to find
 * @return matching index or -1 if not present
 * Time Complexity: O(log n) | Space Complexity: O(1)
 */
class Solution {
    public int search(int[] nums, int target) {
        // Guard against null reference and zero length bounds
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int left = 0;
        int right = nums.length - 1;

        // Perform logarithmic split iterations
        while (left <= right) {
            // Unsigned bit-shift guarantees mid-level index without integer overflow bounds
            int mid = left + ((right - left) >>> 1);
            if (nums[mid] == target) {
                return mid; // Element located
            } else if (nums[mid] < target) {
                left = mid + 1; // Shift lower bound upward
            } else {
                right = mid - 1; // Shift upper bound downward
            }
        }
        return -1;
    }
}`;
      } else {
        return `/**
 * Binary search implementation in Java.
 * Computes midpoint recursively or iteratively within logarithmic boundaries.
 * 
 * Time Complexity: O(log n) worst/avg, O(1) best
 * Space Complexity: O(1) - auxiliary space
 * 
 * @param nums Sorted random-access collection
 * @param target Query identifier
 * @return Insertion location or -1 sentinel
 */
class Solution {
    public int search(int[] nums, int target) {
        // Defensive parameter validations to prevent NullPointerExceptions
        if (nums == null || nums.length == 0) {
            return -1;
        }
        int left = 0;
        int right = nums.length - 1;

        // Invariant: if target exists, it lies in range [left, right]
        while (left <= right) {
            // Prevents sign-bit overflow during calculation of mid on heavy collections
            int mid = left + ((right - left) >>> 1);
            if (nums[mid] == target) {
                return mid; // Exact match found
            } else if (nums[mid] < target) {
                left = mid + 1; // Halves range by raising left bound
            } else {
                right = mid - 1; // Halves range by dropping right bound
            }
        }
        return -1; // Range exhausted, element absent
    }
}`;
      }
    } else if (isJs) {
      if (depth === "beginner") {
        return `// This function searches a sorted list for a target value
function search(nums, target) {
  // Return -1 if list is empty or doesn't exist
  if (!nums || nums.length === 0) return -1;
  let left = 0; // Pointer at the start
  let right = nums.length - 1; // Pointer at the end

  // Keep searching until markers cross each other
  while (left <= right) {
    // Calculate middle index using division
    const mid = left + ((right - left) >> 1);
    const midVal = nums[mid]; // Read middle value
    
    // Check if middle item is our target
    if (midVal === target) {
      return mid; // Found it!
    } else if (midVal < target) {
      left = mid + 1; // Look in right half
    } else {
      right = mid - 1; // Look in left half
    }
  }
  return -1; // Target is not in the list
}`;
      } else if (depth === "intermediate") {
        return `/**
 * Locates the target value in a sorted array.
 * @param {number[]} nums - Sorted integer list
 * @param {number} target - Element to search
 * @returns {number} Index of target, or -1 if absent
 * Time Complexity: O(log n) | Space Complexity: O(1)
 */
function search(nums, target) {
  // Prevent runtime null-dereference faults
  if (!nums || nums.length === 0) return -1;
  let left = 0;
  let right = nums.length - 1;

  // Traversal loop halving bounds at O(log n)
  while (left <= right) {
    // Arithmetic shift right divides by 2 and floor-computes mid
    const mid = left + ((right - left) >> 1);
    const midVal = nums[mid];
    
    if (midVal === target) {
      return mid; // Return matched array offset
    } else if (midVal < target) {
      left = mid + 1; // Pivot search area to right sector
    } else {
      right = mid - 1; // Pivot search area to left sector
    }
  }
  return -1;
}`;
      } else {
        return `/**
 * Logarithmic search algorithm on a sorted list.
 * Replaces division with CPU bit shifts to increase performance.
 * 
 * Time Complexity: O(log n) traversal | Space Complexity: O(1)
 * 
 * @param {Array} nums Sorted query array
 * @param {number} target Query element
 * @returns {number} Sentinel coordinate
 */
function search(nums, target) {
  // Input validations to guarantee stable stack execution
  if (!nums || nums.length === 0) return -1;
  let left = 0;
  let right = nums.length - 1;

  // Traversal boundary loop
  while (left <= right) {
    // Bitwise right-shift (>> 1) calculates midpoint at low register speed
    const mid = left + ((right - left) >> 1);
    const midVal = nums[mid];
    
    if (midVal === target) {
      return mid; // Target matched at mid coordinate
    } else if (midVal < target) {
      left = mid + 1; // Move lower bounds pointer past mid
    } else {
      right = mid - 1; // Move upper bounds pointer before mid
    }
  }
  return -1;
}`;
      }
    }
  }

  // 3. Fallback logic for arbitrary user code
  const lines = code.split("\n");
  const commentedLines = [];

  const inlineCommentSymbol = isPython ? "#" : "//";

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    const indentMatch = line.match(/^\s*/);
    const indent = indentMatch ? indentMatch[0] : "";

    // Skip blank or already commented lines
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      commentedLines.push(line);
      i++;
      continue;
    }

    // 3.1 Function/Class Javadoc or docstring placement
    const isFunc = trimmed.includes("function ") || trimmed.startsWith("def ") || trimmed.startsWith("public ") || trimmed.startsWith("private ") || (trimmed.includes("class ") && !trimmed.startsWith("*"));
    if (isFunc && placement.docstrings) {
      let docText = "";
      if (depth === "beginner") {
        docText = "Simple action to perform search or calculation.";
        if (style.useAnalogies) {
          docText += " Works like looking up a term in a dictionary.";
        }
      } else if (depth === "intermediate") {
        docText = "Performs calculations or queries on input parameters.\n";
        if (style.includeTypes) {
          docText += "Args:\n  arguments - elements to process\n";
        }
        if (placement.complexityNotes) {
          docText += "Time: O(n) linear scan | Space: O(1)";
        }
      } else {
        docText = "Functional routine matching complexity structures.\n";
        if (style.includeAuthor) {
          docText += "Author: Developer | Timestamp: " + new Date().toLocaleDateString() + "\n";
        }
        if (style.suggestAlternatives) {
          docText += "Design Pattern: Utility traversal. Consider Map collections for O(1) speed.\n";
        }
        if (placement.complexityNotes) {
          docText += "Complexity analysis: Time O(n), Space O(n) auxiliary call stack allocation.";
        }
      }

      // Wrap Javadoc or Python docstring
      if (isPython) {
        commentedLines.push(`${indent}"""`);
        commentedLines.push(docText.split("\n").map(l => `${indent}${l}`).join("\n"));
        commentedLines.push(`${indent}"""`);
      } else {
        commentedLines.push(`${indent}/**`);
        commentedLines.push(docText.split("\n").map(l => `${indent} * ${l}`).join("\n"));
        commentedLines.push(`${indent} */`);
      }
    }

    // 3.2 Block comments above control structures
    const isControl = trimmed.startsWith("if ") || trimmed.startsWith("if(") || trimmed.startsWith("for ") || trimmed.startsWith("for(") || trimmed.startsWith("while ") || trimmed.startsWith("while(") || trimmed.startsWith("try ") || trimmed.startsWith("catch ");
    if (isControl && placement.blockAboveControl) {
      let blockText = "";
      if (trimmed.startsWith("if")) {
        blockText = depth === "beginner" ? "Check if our condition matches before doing work" : "Evaluate parameter boundaries and conditional guards";
      } else if (trimmed.startsWith("for") || trimmed.startsWith("while")) {
        blockText = depth === "beginner" ? "Loop through each item in the collection step-by-step" : "Perform loops to traverse memory collection indices";
      } else {
        blockText = "Ensure code executes safely and catches exceptions";
      }
      commentedLines.push(wrap(blockText, inlineCommentSymbol, true).split("\n").map(l => `${indent}${l}`).join("\n"));
    }

    // 3.3 Variable Declarations or simple lines
    const isVariable = (trimmed.includes("let ") || trimmed.includes("const ") || trimmed.includes("var ") || trimmed.includes("int ") || trimmed.includes("double ")) && trimmed.includes("=");
    let inlineAdded = false;
    
    if (isVariable && placement.simpleVariables) {
      const inlineText = depth === "beginner" ? "Save initial starting position value" : "Initialize tracking variable reference pointer";
      commentedLines.push(line + wrap(inlineText, inlineCommentSymbol, false));
      inlineAdded = true;
    }

    // 3.4 Return statements
    const isReturn = trimmed.startsWith("return ");
    if (isReturn && !inlineAdded) {
      const returnText = depth === "beginner" ? "Send final result back to the caller" : "Return computed exit value to the execution stack";
      commentedLines.push(line + wrap(returnText, inlineCommentSymbol, false));
      inlineAdded = true;
    }

    // Default line push if no inline comments added
    if (!inlineAdded) {
      // Inline comments for complex lines
      if (placement.inlineComplex && trimmed.length > 25 && !isFunc && !isControl) {
        const complexText = depth === "beginner" ? "Perform the calculation step" : "Execute statement computation and register values";
        commentedLines.push(line + wrap(complexText, inlineCommentSymbol, false));
      } else {
        commentedLines.push(line);
      }
    }

    i++;
  }

  // Formatting blank lines if configured
  let result = commentedLines.join("\n");
  if (formatting.blankLinesBetweenSections) {
    result = result.replace(/\n(\s*(?:def|class|function|public|private))/g, "\n\n$1");
  }

  return result;
}
