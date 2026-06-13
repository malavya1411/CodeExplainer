# FEATURE: AUTO-COMMENTED CODE EXPORT
# Add this feature to the existing CodeExplainer application
# This prompt generates the complete commented-code feature with UI, logic, and export

---

## FEATURE OVERVIEW

**Name:** Smart Comment Generator  
**Purpose:** Automatically generate comprehensive, educational inline comments for user-submitted code, producing a fully-commented version that can be copied, downloaded, or exported. The commented code serves as self-documenting reference material for future understanding.

**User Value:**
- Beginners get line-by-line explanations embedded in code
- Students can paste commented code into assignments/notes
- Developers can generate documentation-ready code for handoffs
- Teams can create onboarding-friendly codebases
- The commented file becomes a standalone learning artifact

**Differentiation:**
- NOT just adding `// This is a function` — comments are contextually rich, explain WHY not just WHAT
- Three depth levels matching the explanation engine (Beginner/Intermediate/Expert)
- Smart placement: comments above blocks, inline for complex lines, docstrings for functions
- Preserves original code formatting and structure exactly
- Option to generate both inline comments AND separate documentation block

---

## COLOR & DESIGN SPECIFICATIONS (MATCHES EXISTING APP)

### Comment Color Coding (Both Themes)
```css
/* Light Theme */
--comment-beginner: #2D6A4F;      /* Forest Green - simple explanations */
--comment-intermediate: #457B9D;   /* Steel Blue - technical details */
--comment-expert: #6F42C1;        /* Deep Purple - advanced notes (limited use) */
--comment-docstring: #E9C46A;     /* Amber - function/class documentation */
--comment-highlight-bg: #E9F5F0;  /* Light green tint for commented sections */

/* Dark Theme */
--comment-beginner: #3FB950;      /* Bright Green */
--comment-intermediate: #58A6FF;   /* Bright Blue */
--comment-expert: #D2A8FF;        /* Light Purple */
--comment-docstring: #D29922;     /* Amber */
--comment-highlight-bg: #1C2B24;   /* Dark green tint */
```

### UI Components (New)
- **Comment Generator Panel:** Slide-out from right side of Code Panel
- **Comment Preview:** Split view showing original (left) vs commented (right)
- **Comment Toggle:** Show/Hide comments in the main editor
- **Export Commented Code:** Button in toolbar with dropdown options
- **Comment Settings:** Configure comment style, depth, placement rules

---

## COMPLETE FEATURE SPECIFICATIONS

### COMPONENT 1: COMMENT GENERATOR ENGINE

**Logic Requirements:**

#### 1.1 Comment Placement Strategy
The engine must analyze AST (Abstract Syntax Tree) and place comments intelligently:

```
PLACEMENT RULES:
├── Function/Class Definition
│   └── Place DOCSTRING above (multiline comment explaining purpose, params, return)
│
├── Import Statements (grouped)
│   └── Place single comment above block: "Import required libraries"
│
├── Variable Initialization (simple)
│   └── Inline comment (end of line): // Initialize counter to 0
│
├── Variable Initialization (complex expression)
│   └── Comment above: // Calculate initial state based on input parameters
│
├── Control Structures (if/for/while)
│   └── Comment above block: // Check if user is authenticated before proceeding
│   └── Complex condition: Inline breakdown of each part
│
├── Loop Body
│   └── Comment above: // Iterate through each element to find match
│   └── Nested loop: Comment explaining relationship between loops
│
├── Return Statement
│   └── Comment above: // Return the computed result to caller
│   └── Complex return: Inline explaining transformation
│
├── Error Handling (try/catch)
│   └── Comment above try: // Attempt operation that may fail
│   └── Comment above catch: // Handle specific error cases gracefully
│
└── Complex Algorithm Sections
    └── Comment block above: // IMPLEMENTATION NOTE: Using binary search for O(log n) efficiency
```

#### 1.2 Comment Content Rules by Depth

**BEGINNER Comments:**
- Maximum 10 words per comment
- Use everyday analogies
- Explain WHAT the code does, not how
- Avoid technical jargon entirely
- Use active voice: "We sort the list" not "The list is sorted"
- Example: `// Count how many items we have`

**INTERMEDIATE Comments:**
- Up to 20 words, technical terms allowed with implicit context
- Explain HOW and WHY
- Mention data structures and basic patterns
- Note edge cases briefly
- Example: `// Filter array using predicate - O(n) time, excludes falsy values`

**EXPERT Comments:**
- Concise, up to 15 words, dense technical information
- Explain WHY this approach over alternatives
- Reference time/space complexity inline
- Note thread-safety, memory layout, optimization opportunities
- Mention related design patterns or algorithms
- Example: `// O(n) filter vs O(n) reduce - chosen for readability and early exit support`

#### 1.3 Comment Style by Language

**Python:**
```python
"""
Calculate factorial using iterative approach.
Args:
    n: Non-negative integer
Returns:
    Factorial of n
Time: O(n), Space: O(1)
"""
def factorial(n):
    result = 1  # Initialize accumulator to identity value

    # Iterate from 1 to n, multiplying result each time
    for i in range(1, n + 1):
        result *= i  # Accumulate: result = result * i

    return result  # Return computed factorial
```

**JavaScript/TypeScript:**
```javascript
/**
 * Fetches user data from API with caching.
 * @param {string} userId - Unique user identifier
 * @returns {Promise<User>} User object or null if not found
 * @throws {NetworkError} If request fails after 3 retries
 * Time: O(1) cache hit, O(n) miss | Space: O(1)
 */
async function fetchUser(userId) {
    // Check cache first to avoid unnecessary API calls
    if (cache.has(userId)) {
        return cache.get(userId);  // Return cached result immediately
    }

    // Fetch from API with exponential backoff retry logic
    const user = await api.get(`/users/${userId}`, { retries: 3 });

    cache.set(userId, user);  // Store in cache for future requests
    return user;  // Return fresh user data
}
```

**Java:**
```java
/**
 * Sorts employees by salary using merge sort for stable O(n log n) performance.
 * @param employees List of Employee objects (must be mutable)
 * @return New sorted list, original list unchanged
 * @throws IllegalArgumentException if employees is null
 * Time: O(n log n), Space: O(n) - auxiliary array for merging
 */
public List<Employee> sortBySalary(List<Employee> employees) {
    // Defensive copy to prevent modifying caller's list
    List<Employee> sorted = new ArrayList<>(employees);

    // Merge sort guarantees stable sort and O(n log n) worst case
    Collections.sort(sorted, Comparator.comparing(Employee::getSalary));

    return sorted;  // Return new sorted instance
}
```

**C++:**
```cpp
/**
 * @brief Binary search implementation with iterator support
 * @tparam It Random access iterator type
 * @tparam T Value type (must support operator<)
 * @param first Start iterator
 * @param last End iterator (one past last element)
 * @param value Target value to find
 * @return Iterator to found element, or last if not found
 * @complexity Time: O(log n), Space: O(1)
 */
template<typename It, typename T>
It binarySearch(It first, It last, const T& value) {
    // Initialize search bounds to full range
    auto left = first;
    auto right = last;

    // Continue while search space contains elements
    while (left < right) {
        // Calculate midpoint avoiding integer overflow: mid = left + (right - left) / 2
        auto mid = left + (std::distance(left, right) / 2);

        if (*mid < value) {
            left = mid + 1;  // Target in right half, exclude mid
        } else {
            right = mid;  // Target in left half or at mid, include mid
        }
    }

    return left;  // Return insertion point (STL convention)
}
```

---

### COMPONENT 2: COMMENT PREVIEW PANEL

**Visual Design:**
```
+--------------------------------------------------+
|  COMMENT PREVIEW                    [X] Close    |
+--------------------------------------------------+
|                                                   |
|  [Original] [Commented] [Side-by-Side]            |
|                                                   |
|  +------------------+  +------------------+      |
|  | Original Code    |  | Commented Code   |      |
|  | (read-only)      |  | (read-only)      |      |
|  |                  |  |                  |      |
|  | def fib(n):      |  | def fib(n):      |      |
|  |   if n < 2:      |  |   # Base case:   |      |
|  |     return n     |  |   # return n if  |      |
|  |   return fib     |  |   if n < 2:      |      |
|  |     (n-1) + fib  |  |     return n     |      |
|  |     (n-2)        |  |   # Recursive:   |      |
|  |                  |  |   # sum of two   |      |
|  |                  |  |   return fib     |      |
|  |                  |  |     (n-1) + fib  |      |
|  |                  |  |     (n-2)        |      |
|  +------------------+  +------------------+      |
|                                                   |
|  [Copy Commented] [Download .py] [Export All]    |
+--------------------------------------------------+
```

**Behavior:**
- **Original Tab:** Shows user's code with syntax highlighting, no comments
- **Commented Tab:** Shows fully commented version, comments colored by depth
- **Side-by-Side:** Split view with synchronized scrolling (scroll one, both move)
- **Line Sync:** Clicking a line in original highlights corresponding line in commented
- **Comment Toggle:** Checkboxes to show/hide specific comment types (Docstrings, Inline, Block)
- **Depth Switcher:** Same three-segment toggle as main app, updates comments in real-time

**Interactions:**
- **Copy Button:** Copies commented code to clipboard with toast "Commented code copied!"
- **Download Button:** Downloads as `.py`, `.js`, etc. with `_commented` suffix (e.g., `script_commented.py`)
- **Export All:** Dropdown — Raw Text, Markdown (with code block), HTML (styled), PDF
- **Regenerate Button:** If user edits original code, button appears to regenerate comments

---

### COMPONENT 3: INLINE COMMENT TOGGLE IN MAIN EDITOR

**Visual:**
- Toggle switch in Code Toolbar: "Show Comments" (eye icon)
- When ON: Comments appear inline in the editor, faded/italic, different color
- When OFF: Clean code view (default)
- Comments are non-editable (ghost text), original code remains editable

**Behavior:**
- Comments appear as ghost text between lines (not part of actual code)
- Hover comment → tooltip with full explanation if truncated
- Click comment → opens annotation panel for that line
- Comments update in real-time when depth is changed
- If user edits code, comments marked as "[Outdated — Regenerate]" with refresh button

---

### COMPONENT 4: COMMENT SETTINGS & CUSTOMIZATION

**Settings Panel (Slide-out from right):**

```
+--------------------------------------------------+
|  COMMENT SETTINGS                     [X] Close    |
+--------------------------------------------------+
|                                                   |
|  Comment Depth                                    |
|  [Beginner] [Intermediate] [Expert]              |
|                                                   |
|  Comment Placement                                |
|  [x] Docstrings for functions/classes            |
|  [x] Inline comments for complex lines           |
|  [x] Block comments above control structures     |
|  [ ] Comments for simple variable declarations   |
|  [x] Complexity notes (Big-O) in docstrings      |
|                                                   |
|  Comment Style                                    |
|  [x] Use analogies in Beginner mode              |
|  [x] Include parameter types in docstrings       |
|  [ ] Include author/timestamp in docstrings      |
|  [x] Note edge cases in comments                 |
|  [ ] Suggest alternatives in Expert mode         |
|                                                   |
|  Formatting                                       |
|  Max comment length: [80] characters              |
|  Comment indentation: [Match code] [Fixed: 0]     |
|  Blank lines between sections: [x]                |
|                                                   |
|  [Reset to Defaults]        [Apply Changes]      |
+--------------------------------------------------+
```

**Behavior:**
- All settings persist in localStorage
- Real-time preview updates as settings change
- "Reset" restores factory defaults
- Settings apply globally to all future comment generations

---

### COMPONENT 5: EXPORT FORMATS

#### 5.1 Raw Code File
- Original file extension preserved
- Filename suffix: `_commented` (e.g., `algorithm_commented.py`)
- Comments use language-native syntax (`#`, `//`, `/* */`, `<!-- -->`)
- UTF-8 encoding, LF line endings
- Includes header comment: `// Generated by CodeExplainer — [timestamp]`

#### 5.2 Markdown Export
```markdown
# Commented Code: algorithm.py

**Generated:** 2026-06-13  
**Language:** Python  
**Comment Depth:** Intermediate

---

## Overview
This script implements a binary search algorithm to find elements in sorted arrays.

## Code

```python
"""
Find target in sorted array using binary search.
Args:
    nums: Sorted list of integers
    target: Value to search for
Returns:
    Index of target, or -1 if not found
Time: O(log n), Space: O(1)
"""
def search(nums, target):
    left = 0              # Initialize left boundary to start of array
    right = len(nums) - 1  # Initialize right boundary to last index

    # Continue searching while boundaries haven't crossed
    while left <= right:
        mid = (left + right) // 2  # Calculate middle index

        if nums[mid] == target:
            return mid  # Found target, return its index
        elif nums[mid] < target:
            left = mid + 1  # Target in right half, move left boundary
        else:
            right = mid - 1  # Target in left half, move right boundary

    return -1  # Target not found in array
```

## Key Concepts
- **Binary Search:** Divide search space in half each iteration
- **Two Pointers:** Track search boundaries with left and right indices
- **Time Complexity:** O(log n) — search space halves each step
```

#### 5.3 HTML Export (Styled)
- Self-contained HTML file with embedded CSS
- Syntax highlighting matching app theme (Light/Dark)
- Comments color-coded by depth with legend
- Collapsible sections for each function/class
- "Copy Code" button per section
- Print-friendly stylesheet

#### 5.4 PDF Export
- Formatted document with syntax highlighting
- Page breaks between major sections
- Header with filename and generation date
- Footer with page numbers
- Table of contents for large files

---

## INTEGRATION WITH EXISTING APP

### Where to Add in UI

**Header Toolbar Addition:**
```
[Upload] [Clear] [Format] [Show Comments Toggle] [Generate Comments ▼] [Export ▼] [Settings]
```

**Generate Comments Dropdown:**
- Generate Comments (Beginner)
- Generate Comments (Intermediate)
- Generate Comments (Expert)
- Open Comment Preview Panel
- Comment Settings...

**Export Dropdown Addition:**
- Export Explanation (existing)
- Export Commented Code (new)
  - As Raw File (.py, .js, etc.)
  - As Markdown (.md)
  - As HTML (.html)
  - As PDF (.pdf)

**Keyboard Shortcuts (New):**
- `Ctrl/Cmd + Shift + C` — Generate comments at current depth
- `Ctrl/Cmd + Shift + V` — Open comment preview panel
- `Ctrl/Cmd + Alt + C` — Copy commented code to clipboard
- `Ctrl/Cmd + /` (existing) — Toggle inline comments visibility

### State Management Addition

```typescript
// commentStore.ts
interface CommentState {
  commentedCode: string | null;           // Generated commented version
  isGenerating: boolean;                   // Loading state
  generationError: string | null;          // Error message
  showInlineComments: boolean;             // Toggle in editor
  commentSettings: CommentSettings;        // User preferences
  lastGenerated: string | null;            // Timestamp

  generateComments: (code: string, depth: Depth, settings: CommentSettings) => Promise<void>;
  setShowInlineComments: (show: boolean) => void;
  updateSettings: (settings: Partial<CommentSettings>) => void;
  copyCommentedCode: () => void;
  downloadCommentedCode: (format: 'raw' | 'markdown' | 'html' | 'pdf') => void;
}

interface CommentSettings {
  depth: 'beginner' | 'intermediate' | 'expert';
  placement: {
    docstrings: boolean;
    inlineComplex: boolean;
    blockAboveControl: boolean;
    simpleVariables: boolean;
    complexityNotes: boolean;
  };
  style: {
    useAnalogies: boolean;
    includeTypes: boolean;
    includeAuthor: boolean;
    noteEdgeCases: boolean;
    suggestAlternatives: boolean;
  };
  formatting: {
    maxLength: number;
    indentation: 'match' | 'fixed';
    fixedIndent: number;
    blankLinesBetweenSections: boolean;
  };
}
```

---

## MOCK DATA FOR COMMENT GENERATOR

Use this to test the UI immediately:

**Input Code (Python):**
```python
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

**Beginner Commented Output:**
```python
# This function finds a number in the Fibonacci sequence
def fibonacci(n):
    # If n is 0 or 1, just return n (base case)
    if n < 2:
        return n
    # Otherwise, add the two previous Fibonacci numbers
    return fibonacci(n-1) + fibonacci(n-2)
```

**Intermediate Commented Output:**
```python
"""
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
    return fibonacci(n-1) + fibonacci(n-2)
```

**Expert Commented Output:**
```python
"""
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
    return fibonacci(n-1) + fibonacci(n-2)
```

---

## AI PROMPT FOR COMMENT GENERATION (Backend/Integration)

```
You are a senior developer writing educational code comments. Generate comprehensive, 
well-placed comments for the provided code at the specified depth level.

## INPUT FORMAT:
Language: {language}
Depth: {beginner|intermediate|expert}
Settings: {placement_rules, style_preferences}
Code:
```{language}
{code}
```

## OUTPUT FORMAT:
Return ONLY the commented code. No explanations, no markdown fences, just the raw code 
with comments inserted at appropriate locations.

## COMMENT RULES:
1. Preserve original code EXACTLY — only add comments, never modify code
2. Use language-appropriate comment syntax:
   - Python: # inline, """ docstrings
   - JS/TS: // inline, /** */ docstrings  
   - Java: // inline, /** */ Javadoc
   - C++: // inline, /** */ or /* */ blocks
   - Go: // inline, /** */ doc comments
3. Match comment depth to user level:
   - Beginner: Simple language, analogies, max 10 words
   - Intermediate: Technical terms, complexity notes, max 20 words
   - Expert: Dense technical info, trade-offs, alternatives, max 15 words
4. Place comments strategically:
   - Docstrings above functions/classes (multiline)
   - Inline comments at end of complex lines
   - Block comments above control structures
   - Skip obvious lines (simple assignments, standard patterns)
5. Include in docstrings when applicable:
   - Purpose (1 sentence)
   - Parameters with types
   - Return value with type
   - Time/Space complexity
   - Edge cases or warnings
6. Never use "This is a..." or "This function..." — be specific and active
7. For expert depth, suggest optimization alternatives in docstrings

## EXAMPLE OUTPUT (Python, Intermediate):
```python
"""
Sort array using quicksort with in-place partitioning.
Args:
    arr: List of comparable elements
    low: Starting index (default 0)
    high: Ending index (default len-1)
Returns:
    None — sorts in-place
Time: O(n log n) avg, O(n²) worst | Space: O(log n) stack
"""
def quicksort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1  # Set default high to last index

    if low < high:
        # Partition array and get pivot final position
        pi = partition(arr, low, high)

        # Recursively sort elements before and after partition
        quicksort(arr, low, pi - 1)
        quicksort(arr, pi + 1, high)


def partition(arr, low, high):
    """Lomuto partition scheme — choose last element as pivot."""
    pivot = arr[high]  # Select rightmost element as pivot
    i = low - 1  # Index of smaller element boundary

    # Iterate through subarray, moving smaller elements left
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1  # Expand smaller-element boundary
            arr[i], arr[j] = arr[j], arr[i]  # Swap into correct partition

    # Place pivot in correct position between partitions
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1  # Return pivot's final sorted index
```
```

---

## IMPLEMENTATION CHECKLIST

### Frontend Components to Build
- [ ] CommentGeneratorButton (toolbar dropdown)
- [ ] CommentPreviewPanel (slide-out with tabs)
- [ ] CommentedCodeView (read-only editor with colored comments)
- [ ] SideBySideComparator (synchronized scrolling)
- [ ] InlineCommentGhost (non-editable comment overlay in main editor)
- [ ] CommentSettingsPanel (configuration slide-out)
- [ ] CommentExportMenu (dropdown with format options)
- [ ] CommentDepthBadge (shows current depth in preview)
- [ ] RegenerateCommentButton (appears when code changes)
- [ ] CommentToastNotifications ("Copied!", "Generated!", "Downloaded!")

### Logic/Utilities to Build
- [ ] commentGenerator.ts — Main engine orchestrating generation
- [ ] commentPlacement.ts — AST analysis for optimal comment placement
- [ ] commentFormatter.ts — Language-specific comment syntax formatting
- [ ] commentDepthAdapter.ts — Adjusts language complexity by depth
- [ ] codeDiffer.ts — Detects code changes to mark comments outdated
- [ ] exportGenerator.ts — Markdown, HTML, PDF generation from commented code
- [ ] commentSettingsValidator.ts — Validates and normalizes settings

### Integration Points
- [ ] Add "Generate Comments" to CodeToolbar
- [ ] Add comment preview to ExplanationPanel tabs (new "Commented Code" tab)
- [ ] Integrate with existing DepthSwitcher (shared state)
- [ ] Integrate with existing Theme system (comment colors)
- [ ] Integrate with existing Export system (new formats)
- [ ] Integrate with existing KeyboardShortcuts hook (new shortcuts)
- [ ] Add to existing Zustand stores (commentStore)

### States to Handle
- [ ] Empty: "Paste code to generate comments" with illustration
- [ ] Loading: Skeleton UI with pulsing comment placeholders
- [ ] Success: Full preview with copy/download buttons
- [ ] Error: "Could not generate comments" with retry button
- [ ] Outdated: "Code changed — comments may be stale" with regenerate
- [ ] Generating: Progress bar with "Analyzing structure... Adding comments..."

---

## FINAL INSTRUCTIONS FOR AI TOOL

Generate this feature as a complete, integrated module for the existing CodeExplainer app. 

Requirements:
1. ALL components must be fully implemented with TypeScript (strict types, no `any`)
2. Use the EXACT color palette specified (green-blue system, no purple gradients)
3. Match existing app design language: 4px border-radius, 8px grid, Inter + JetBrains Mono fonts
4. Include the mock data so the feature works immediately without backend
5. Implement ALL export formats: Raw, Markdown, HTML, PDF
6. Add ALL keyboard shortcuts specified
7. Ensure responsive behavior: works on mobile (simplified preview), tablet, desktop
8. Accessibility: ARIA labels, keyboard navigation, focus indicators, screen reader support
9. Animations: Smooth slide-out panels, fade transitions, 300ms theme-consistent
10. No placeholder text, no TODO comments, no unfinished features

The commented code feature must feel like a native, first-class part of the application — 
not a bolted-on afterthought. Users should be able to generate, preview, customize, and 
export commented code in under 30 seconds.
