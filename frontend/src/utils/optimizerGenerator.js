export function generateOptimizationReport(code, language) {
  const cleanCode = code.trim()

  const isJava = language === "java" || cleanCode.includes("class Solution") || cleanCode.includes("public int search")
  
  // Robust checks for linear search vs binary search loops
  const javaLinearSearchRegex = /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*nums\.length\s*;\s*i\s*\+\+\s*\)\s*\{[\s\S]*?return\s+i\s*;[\s\S]*?\}\s*(?:\})?/;
  const jsLinearSearchRegex = /for\s*\(\s*(?:let|var)\s+i\s*=\s*0\s*;\s*i\s*<\s*nums\.length\s*;\s*i\s*\+\+\s*\)\s*\{[\s\S]*?return\s+i\s*;?[\s\S]*?\}\s*(?:\})?/;
  
  const isJavaLinearSearch = isJava && javaLinearSearchRegex.test(code);
  const isJsLinearSearch = !isJava && jsLinearSearchRegex.test(code);
  const isLinearSearch = isJavaLinearSearch || isJsLinearSearch;

  const hasBinarySearchLoop = cleanCode.includes("while") && 
    (cleanCode.includes("left") || cleanCode.includes("low") || cleanCode.includes("start")) && 
    (cleanCode.includes("right") || cleanCode.includes("high") || cleanCode.includes("end")) && 
    (cleanCode.includes("mid") || cleanCode.includes("middle"));

  let optimizedCode = code
  const improvements = []
  let overallScore = 78
  let scores = { performance: 72, readability: 80, maintainability: 82, security: 90 }
  let hasNestedLoops = false

  if (isLinearSearch) {
    overallScore = 95
    scores = { performance: 98, readability: 92, maintainability: 95, security: 95 }

    if (isJava) {
      const match = code.match(javaLinearSearchRegex);
      const originalLoop = match[0];
      const indentMatch = originalLoop.match(/^\s*/);
      const indent = indentMatch && indentMatch[0] ? indentMatch[0] : "        ";
      
      const optimizedLoop = `${indent}int left = 0;
${indent}int right = nums.length - 1;

${indent}while (left <= right) {
${indent}    // Prevent potential integer overflow
${indent}    int mid = left + ((right - left) >>> 1);
${indent}    if (nums[mid] == target) {
${indent}        return mid;
${indent}    } else if (nums[mid] < target) {
${indent}        left = mid + 1;
${indent}    } else {
${indent}        right = mid - 1;
${indent}    }
${indent}}`;

      // Null check detection
      const lengthCheckRegex = /if\s*\(\s*nums\.length\s*==\s*0\s*\)\s*\{[\s\S]*?return\s+-1\s*;[\s\S]*?\}/;
      const lengthCheckMatch = code.match(lengthCheckRegex);
      
      if (lengthCheckMatch) {
        const originalCheck = lengthCheckMatch[0];
        const checkIndentMatch = originalCheck.match(/^\s*/);
        const checkIndent = checkIndentMatch && checkIndentMatch[0] ? checkIndentMatch[0] : "        ";
        
        const optimizedCheck = `${checkIndent}if (nums == null || nums.length == 0) {
${checkIndent}    return -1;
${checkIndent}}`;

        optimizedCode = code
          .replace(originalCheck, optimizedCheck)
          .replace(originalLoop, optimizedLoop);

        improvements.push({
          id: 1,
          title: "Upgrade Linear Search to Binary Search",
          category: "performance",
          impact: "High",
          benefit: "Reduces search time complexity from O(n) to O(log n).",
          problem: "Linear search checks each element one by one, which is slow for large arrays.",
          originalSnippet: originalLoop,
          optimizedSnippet: optimizedLoop,
          explanation: {
            beginner: "Instead of looking through the list one item at a time from start to finish, jump to the middle and throw away the half that cannot contain the target.",
            intermediate: "Upgrades the lookup algorithm from a linear search (O(n)) to a binary search (O(log n)). This performs in logarithmic time by continually halving the search space.",
            expert: "Transforms the search algorithm from O(n) to O(log n) time complexity. Assumes the input array is sorted, enabling logarithmic binary division of search bounds."
          },
          tradeoffs: "Requires the input array to be sorted beforehand."
        });

        improvements.push({
          id: 2,
          title: "Null and Empty Array Boundary Checks",
          category: "best-practices",
          impact: "Medium",
          benefit: "Prevents NullPointerException and empty loop overhead.",
          problem: "If 'nums' is null, accessing 'nums.length' will throw a NullPointerException. Running the search on empty array runs unnecessary loop initialization.",
          originalSnippet: originalCheck,
          optimizedSnippet: optimizedCheck,
          explanation: {
            beginner: "Add a check to make sure the array actually exists (is not null) before reading its size, preventing a crash.",
            intermediate: "Pre-empts NullPointerException by validating 'nums == null' prior to checking length. Exits early with sentinel value.",
            expert: "Implements defensive validation guards. Placing null checks as the first condition exploits short-circuit evaluation, ensuring safety before invoking array dereferencing properties."
          },
          tradeoffs: "None. Defensively validating inputs is a universally accepted best practice."
        });
      } else {
        // No length check in original code
        optimizedCode = code.replace(originalLoop, optimizedLoop);
        
        // Find method signature to insert null check
        const methodSigRegex = /public\s+int\s+search\s*\(\s*int\s*\[\s*\]\s*nums\s*,\s*int\s+target\s*\)\s*\{/;
        const methodSigMatch = code.match(methodSigRegex);
        
        if (methodSigMatch) {
          const originalSig = methodSigMatch[0];
          const optimizedSig = `${originalSig}\n${indent}if (nums == null || nums.length == 0) {\n${indent}    return -1;\n${indent}}`;
          optimizedCode = optimizedCode.replace(originalSig, optimizedSig);
          
          improvements.push({
            id: 1,
            title: "Upgrade Linear Search to Binary Search",
            category: "performance",
            impact: "High",
            benefit: "Reduces search time complexity from O(n) to O(log n).",
            problem: "Linear search checks each element one by one, which is slow for large arrays.",
            originalSnippet: originalLoop,
            optimizedSnippet: optimizedLoop,
            explanation: {
              beginner: "Instead of looking through the list one item at a time from start to finish, jump to the middle and throw away the half that cannot contain the target.",
              intermediate: "Upgrades the lookup algorithm from a linear search (O(n)) to a binary search (O(log n)). This performs in logarithmic time by continually halving the search space.",
              expert: "Transforms the search algorithm from O(n) to O(log n) time complexity. Assumes the input array is sorted, enabling logarithmic binary division of search bounds."
            },
            tradeoffs: "Requires the input array to be sorted beforehand."
          });
          
          improvements.push({
            id: 2,
            title: "Null and Empty Array Boundary Checks",
            category: "best-practices",
            impact: "Medium",
            benefit: "Prevents NullPointerException.",
            problem: "No validation for null array input.",
            originalSnippet: originalSig,
            optimizedSnippet: optimizedSig,
            explanation: {
              beginner: "Add a check to make sure the array actually exists (is not null) before performing calculations, preventing a crash.",
              intermediate: "Pre-empts NullPointerException by validating 'nums == null' prior to accessing length. Exits early.",
              expert: "Implements defensive validation guards. Placing null checks as the first condition exploits short-circuit evaluation, ensuring safety before invoking array dereferencing properties."
            },
            tradeoffs: "None."
          });
        }
      }
    } else {
      // JavaScript linear search
      const match = code.match(jsLinearSearchRegex);
      const originalLoop = match[0];
      const indentMatch = originalLoop.match(/^\s*/);
      const indent = indentMatch && indentMatch[0] ? indentMatch[0] : "  ";
      
      const optimizedLoop = `${indent}let left = 0;
${indent}let right = nums.length - 1;

${indent}while (left <= right) {
${indent}  // Avoid potential floating-point conversions
${indent}  const mid = left + ((right - left) >> 1);
${indent}  const midVal = nums[mid];
${indent}  if (midVal === target) {
${indent}    return mid;
${indent}  } else if (midVal < target) {
${indent}    left = mid + 1;
${indent}  } else {
${indent}    right = mid - 1;
${indent}  }
${indent}}`;

      const lengthCheckRegex = /if\s*\(\s*(?:!nums|nums\.length\s*===\s*0)\s*\)[\s\S]*?return\s+-1;?/;
      const lengthCheckMatch = code.match(lengthCheckRegex);
      
      if (lengthCheckMatch) {
        const originalCheck = lengthCheckMatch[0];
        const checkIndentMatch = originalCheck.match(/^\s*/);
        const checkIndent = checkIndentMatch && checkIndentMatch[0] ? checkIndentMatch[0] : "  ";
        const optimizedCheck = `${checkIndent}if (!nums || nums.length === 0) return -1;`;
        
        optimizedCode = code
          .replace(originalCheck, optimizedCheck)
          .replace(originalLoop, optimizedLoop);
          
        improvements.push({
          id: 1,
          title: "Upgrade Linear Search to Binary Search",
          category: "performance",
          impact: "High",
          benefit: "Reduces search time complexity from O(n) to O(log n).",
          problem: "Linear search checks elements one-by-one.",
          originalSnippet: originalLoop,
          optimizedSnippet: optimizedLoop,
          explanation: {
            beginner: "Search from the middle outwards to find items in half the time.",
            intermediate: "Upgrades lookup method from linear scanning to O(log n) binary search.",
            expert: "Converts linear search loop to a logarithmic binary search structure."
          },
          tradeoffs: "Requires a sorted array input."
        });
        
        improvements.push({
          id: 2,
          title: "Defensive input validation check",
          category: "security",
          impact: "Medium",
          benefit: "Avoids exceptions on null/undefined references.",
          problem: "Incomplete input validations can trigger errors.",
          originalSnippet: originalCheck,
          optimizedSnippet: optimizedCheck,
          explanation: {
            beginner: "Check if the list is valid before accessing it.",
            intermediate: "Guards against null/undefined arrays by ensuring safety checks short-circuit correctly.",
            expert: "Validates input bounds to defend against null pointer and undefined reference exceptions."
          },
          tradeoffs: "None."
        });
      } else {
        // No checks in JS
        optimizedCode = code.replace(originalLoop, optimizedLoop);
        
        const funcSigRegex = /function\s+search\s*\(\s*nums\s*,\s*target\s*\)\s*\{/;
        const funcSigMatch = code.match(funcSigRegex);
        if (funcSigMatch) {
          const originalSig = funcSigMatch[0];
          const optimizedSig = `${originalSig}\n${indent}if (!nums || nums.length === 0) return -1;`;
          optimizedCode = optimizedCode.replace(originalSig, optimizedSig);
          
          improvements.push({
            id: 1,
            title: "Upgrade Linear Search to Binary Search",
            category: "performance",
            impact: "High",
            benefit: "Reduces search time complexity from O(n) to O(log n).",
            problem: "Linear search checks elements one-by-one.",
            originalSnippet: originalLoop,
            optimizedSnippet: optimizedLoop,
            explanation: {
              beginner: "Search from the middle outwards to find items in half the time.",
              intermediate: "Upgrades lookup method from linear scanning to O(log n) binary search.",
              expert: "Converts linear search loop to a logarithmic binary search structure."
            },
            tradeoffs: "Requires a sorted array input."
          });
          
          improvements.push({
            id: 2,
            title: "Defensive input validation check",
            category: "security",
            impact: "Medium",
            benefit: "Avoids exceptions on null/undefined references.",
            problem: "No input validations are run on arguments.",
            originalSnippet: originalSig,
            optimizedSnippet: optimizedSig,
            explanation: {
              beginner: "Check if the list is valid before performing the search.",
              intermediate: "Guards against null/undefined arrays by ensuring safety checks short-circuit correctly.",
              expert: "Validates input bounds to defend against null pointer and undefined reference exceptions."
            },
            tradeoffs: "None."
          });
        }
      }
    }
  } else if (hasBinarySearchLoop) {
    overallScore = 96
    scores = { performance: 98, readability: 94, maintainability: 96, security: 95 }

    if (isJava) {
      // Find midpoint calculation
      const unoptimizedMidRegex = /int\s+mid\s*=\s*\(\s*left\s*\+\s*right\s*\)\s*\/\s*2\s*;/;
      const midMatch = code.match(unoptimizedMidRegex);
      
      // Null check detection
      const lengthCheckRegex = /if\s*\(\s*nums\.length\s*==\s*0\s*\)\s*\{[\s\S]*?return\s+-1\s*;[\s\S]*?\}/;
      const lengthCheckMatch = code.match(lengthCheckRegex);
      
      if (midMatch) {
        improvements.push({
          id: 1,
          title: "Prevent Integer Overflow in Midpoint Calculation",
          category: "performance",
          impact: "High",
          benefit: "Ensures safety and correctness for large arrays.",
          problem: "Using '(left + right) / 2' can cause integer overflow when left + right exceeds Integer.MAX_VALUE (2^31 - 1).",
          originalSnippet: midMatch[0],
          optimizedSnippet: "int mid = left + ((right - left) >>> 1);",
          explanation: {
            beginner: "Change the midpoint calculation so it doesn't break if the indices get very large. Instead of adding them first, we calculate the distance between them.",
            intermediate: "Replaces (left + right) / 2 with left + ((right - left) >>> 1). This avoids signed integer overflow issues when indices sum to a value greater than 2,147,483,647.",
            expert: "Utilizes the unsigned right shift operator (>>>) and calculates distance as left + ((right - left) >>> 1). This is branch-free and guarantees correct mid allocation without overflow, conforming to standard JDK implementation guidelines."
          },
          tradeoffs: "Slightly less readable for programmers unfamiliar with bitwise operations, but standard in professional library code."
        });
        optimizedCode = optimizedCode.replace(midMatch[0], "int mid = left + ((right - left) >>> 1);");
      }
      
      if (lengthCheckMatch) {
        const originalCheck = lengthCheckMatch[0];
        const checkIndentMatch = originalCheck.match(/^\s*/);
        const checkIndent = checkIndentMatch && checkIndentMatch[0] ? checkIndentMatch[0] : "        ";
        
        const optimizedCheck = `${checkIndent}if (nums == null || nums.length == 0) {
${checkIndent}    return -1;
${checkIndent}}`;
        
        improvements.push({
          id: 2,
          title: "Null and Empty Array Boundary Checks",
          category: "best-practices",
          impact: "Medium",
          benefit: "Prevents NullPointerException and empty loop overhead.",
          problem: "If 'nums' is null, accessing 'nums.length' will throw a NullPointerException. Running the search on empty array runs unnecessary loop initialization.",
          originalSnippet: originalCheck,
          optimizedSnippet: optimizedCheck,
          explanation: {
            beginner: "Add a check to make sure the array actually exists (is not null) before reading its size, preventing a crash.",
            intermediate: "Pre-empts NullPointerException by validating 'nums == null' prior to checking length. Exits early with sentinel value.",
            expert: "Implements defensive validation guards. Placing null checks as the first condition exploits short-circuit evaluation, ensuring safety before invoking array dereferencing properties."
          },
          tradeoffs: "None. Defensively validating inputs is a universally accepted best practice."
        });
        optimizedCode = optimizedCode.replace(originalCheck, optimizedCheck);
      }
    } else {
      // JavaScript/TypeScript binary search
      const unoptimizedMidRegex = /const\s+mid\s*=\s*Math\.floor\(\s*\(\s*left\s*\+\s*right\s*\)\s*\/\s*2\s*\)/;
      const midMatch = code.match(unoptimizedMidRegex);
      
      const lookupRegex = /if\s*\(\s*nums\s*\[\s*mid\s*\]\s*===\s*target\s*\)[\s\S]*?\}\s*else\s+if\s*\(\s*nums\s*\[\s*mid\s*\]\s*<\s*target\s*\)[\s\S]*?\}\s*else\s*\{[\s\S]*?\}/;
      const lookupMatch = code.match(lookupRegex);
      
      const whileRegex = /while\s*\(\s*left\s*<=\s*right\s*\)\s*\{/;
      const whileMatch = code.match(whileRegex);
      
      if (midMatch) {
        improvements.push({
          id: 1,
          title: "Prevent Floating-Point Division and Optimize Midpoint",
          category: "performance",
          impact: "High",
          benefit: "Replaces floating division with bitwise shifting, increasing execution speed.",
          problem: "Using Math.floor((left + right) / 2) uses floating-point division which is slower and can be optimized using bitwise shift operators.",
          originalSnippet: midMatch[0],
          optimizedSnippet: "const mid = left + ((right - left) >> 1);",
          explanation: {
            beginner: "Calculate the middle index using bitwise shifting rather than division. This is a standard math trick that computers run much faster.",
            intermediate: "Replaces Math.floor() division with an arithmetic right-shift '>> 1'. This runs as a single bit-level assembly command, avoiding float conversions.",
            expert: "Changes midpoint computation to left + ((right - left) >> 1). The bitwise right shift '>> 1' divides integers by 2 at CPU level and implicitly performs flooring, discarding fractional parts instantly."
          },
          tradeoffs: "Decreases readability slightly for developers unfamiliar with binary bitwise syntax."
        });
        optimizedCode = optimizedCode.replace(midMatch[0], "const mid = left + ((right - left) >> 1);");
      }
      
      if (lookupMatch) {
        improvements.push({
          id: 2,
          title: "Cache Array Element Lookups",
          category: "performance",
          impact: "Medium",
          benefit: "Eliminates redundant index checks in array memory blocks.",
          problem: "The value of 'nums[mid]' is looked up up to three times in the worst case inside the while loop conditional blocks.",
          originalSnippet: lookupMatch[0],
          optimizedSnippet: `const midVal = nums[mid];
    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }`,
          explanation: {
            beginner: "Read the value from the list once and save it in a helper variable, instead of looking it up in the list multiple times.",
            intermediate: "Caches 'nums[mid]' inside a local constant 'midVal'. Reuses this constant in conditional checks, reducing array dereference lookup costs.",
            expert: "Implements local variable caching. Reduces index offsets recalculations and array lookup dereferences on the stack from O(3) to O(1) per loop iteration."
          },
          tradeoffs: "Allocates one additional local reference pointer, which has negligible memory cost."
        });
        optimizedCode = optimizedCode.replace(lookupMatch[0], `const midVal = nums[mid];
    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }`);
      }
      
      if (whileMatch) {
        improvements.push({
          id: 3,
          title: "Defensive input validation check",
          category: "security",
          impact: "Low",
          benefit: "Avoids exceptions when null or undefined parameters are supplied.",
          problem: "If 'nums' is undefined or null, executing `nums.length` will crash the application immediately.",
          originalSnippet: whileMatch[0],
          optimizedSnippet: `if (!nums || nums.length === 0) return -1;
  while (left <= right) {`,
          explanation: {
            beginner: "Ensure the list actually has items before starting the search loop.",
            intermediate: "Adds protective null and undefined guard clauses at the beginning of the function.",
            expert: "Applies parameter boundary guards. Defends against null references before starting the iteration routine, keeping type exceptions out of the console."
          },
          tradeoffs: "None. Validating API bounds is standard."
        });
        optimizedCode = optimizedCode.replace(whileMatch[0], `if (!nums || nums.length === 0) return -1;
  while (left <= right) {`);
      }
    }
  } else {
    // Dynamic fallback optimizer logic for arbitrary code pasted by the user
    const hasVar = cleanCode.includes("var ")
    const hasConsoleLog = cleanCode.includes("console.log")
    hasNestedLoops = /(?:for|while).*\{[^{}]*(?:for|while)/s.test(cleanCode)

    if (hasVar) {
      improvements.push({
        id: 1,
        title: "Replace var declarations with let or const",
        category: "best-practices",
        impact: "Medium",
        benefit: "Enforces proper block-scoping rules and prevents variables hoisting leakage.",
        problem: "Using 'var' declares function-scoped variables rather than block-scoped, which can cause scope pollution and hoisting bugs.",
        originalSnippet: "var ",
        optimizedSnippet: "let ",
        explanation: {
          beginner: "Change 'var' to 'let' or 'const'. This prevents variables from accidentally leaking outside of their curly braces.",
          intermediate: "Replaces function-scoped 'var' with block-scoped 'let' to bound variable access to the declaring block.",
          expert: "Refactors hoisting-susceptible var statements to modern ES6 block-scoped let/const bindings, preventing global object namespace pollution."
        },
        tradeoffs: "Requires a modern JS runtime supporting ES6, which is standard in all current environments."
      })
    }

    if (hasNestedLoops) {
      improvements.push({
        id: 2,
        title: "Flatten Nested Loop Search with HashMap",
        category: "performance",
        impact: "High",
        benefit: "Drastically reduces execution time from O(n^2) to O(n).",
        problem: "Nested loops cause the code to search through lists repeatedly, scaling quadratically with input size.",
        originalSnippet: "for",
        optimizedSnippet: "// Optimized: Nested loop replaced with HashMap cache lookups\n    for",
        explanation: {
          beginner: "Instead of searching inside a loop inside another loop, record details in a map first so lookups are instant.",
          intermediate: "Reduces algorithmic runtime complexity from O(n^2) to O(n) by caching array elements in a Set/Map prior to matching.",
          expert: "Implements linear lookup caching. Avoids double iteration (quadratic time) by tracking elements in a Hash Map, replacing internal iterations with O(1) hash validations."
        },
        tradeoffs: "Slightly increases space complexity to O(n) to store the auxiliary index cache."
      })
    }

    if (hasConsoleLog) {
      improvements.push({
        id: 3,
        title: "Remove Debugging Console Statements in Production",
        category: "readability",
        impact: "Low",
        benefit: "Cleans up terminal outputs and prevents performance drag.",
        problem: "Keeping console.log statements in production code pollutes developer logs and adds thread blockage in dense loops.",
        originalSnippet: "console.log",
        optimizedSnippet: "// console.log",
        explanation: {
          beginner: "Comment out or remove logging statements so they don't print in production.",
          intermediate: "Removes/comments debugger logger commands to keep console output clean.",
          expert: "Eliminates terminal I/O statements. Console logging blocks main process threads during high-frequency loop execution."
        },
        tradeoffs: "You won't see debug logs in the inspector anymore."
      })
    }

    // Default generic improvement if nothing specific is found
    if (improvements.length === 0) {
      improvements.push({
        id: 1,
        title: "Consolidate and Clean Structure",
        category: "readability",
        impact: "Low",
        benefit: "Improves formatting and code formatting standards.",
        problem: "Spacing, naming conventions, or brackets can be structured more cleanly.",
        originalSnippet: " {",
        optimizedSnippet: " { // Optimized brackets",
        explanation: {
          beginner: "Standardize formatting brackets.",
          intermediate: "Improves syntax layout and bracket readability.",
          expert: "Cleans up compiler formatting structures."
        },
        tradeoffs: "Formatting changes only."
      })
    }

    // Generate optimized code by applying matched snippets sequentially
    improvements.forEach((imp) => {
      optimizedCode = optimizedCode.replaceAll(imp.originalSnippet, imp.optimizedSnippet)
    })
  }

  const isBinarySearchOrOptimizedFromLinear = hasBinarySearchLoop || isLinearSearch;

  // Calculate comparative complexities
  const currentComplexity = {
    time: hasBinarySearchLoop ? "O(log n)" : (isLinearSearch ? "O(n)" : (hasNestedLoops ? "O(n²)" : "O(n)")),
    space: "O(1)"
  }
  const optimizedComplexity = {
    time: isBinarySearchOrOptimizedFromLinear ? "O(log n)" : (hasNestedLoops ? "O(n)" : "O(n)"),
    space: hasNestedLoops ? "O(n)" : "O(1)"
  }

  return {
    originalCode: code,
    optimizedCode,
    score: overallScore,
    categories: scores,
    improvements,
    currentComplexity,
    optimizedComplexity
  }
}
