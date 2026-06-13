# CODE EXPLAINER - AI EXECUTION PROMPT
# Copy-paste this ENTIRE file into your AI coding tool (v0, Bolt, etc.)
# This prompt will generate a complete, production-ready interactive code explainer application

---

## SYSTEM CONTEXT
You are an expert full-stack developer and UI/UX designer. You are building "CodeExplainer" — an interactive web application that transforms complex code into simple, visual, step-by-step explanations. This is NOT a generic AI chatbot. It is a specialized developer education tool with interactive execution simulation, visual diagrams, and adaptive explanation depth.

---

## CORE IDENTITY & DESIGN PHILOSOPHY
- **Purpose:** Help developers understand code through interactive visualization, not static text dumps
- **Target Users:** Junior developers, students, code reviewers, self-taught programmers
- **Vibe:** Clean, professional, Swiss-design inspired. Think "VS Code meets Khan Academy"
- **Anti-Patterns:** NO purple gradients, NO generic AI chatbot aesthetics, NO sparkles/magic effects, NO "Ask AI" floating buttons
- **Feel:** Serious tool that happens to be delightful to use

---

## COLOR SYSTEM (STRICT - NO DEVIATION)

### Light Theme
```css
:root[data-theme="light"] {
  --bg-primary: #F8F9FA;
  --bg-secondary: #FFFFFF;
  --bg-tertiary: #E9ECEF;
  --bg-code: #F1F3F5;

  --text-primary: #1A1D23;
  --text-secondary: #495057;
  --text-muted: #ADB5BD;

  --accent-primary: #2D6A4F;      /* Forest Green */
  --accent-secondary: #40916C;    /* Mint Green */
  --accent-tertiary: #52B788;     /* Light Green */
  --accent-hover: #1B4332;        /* Dark Green */

  --border: #DEE2E6;
  --success: #2D6A4F;
  --warning: #E9C46A;
  --error: #E63946;
  --info: #457B9D;

  /* Syntax Highlighting */
  --syntax-keyword: #D73A49;
  --syntax-string: #032F62;
  --syntax-function: #6F42C1;
  --syntax-comment: #6A737D;
  --syntax-number: #005CC5;
}
```

### Dark Theme
```css
:root[data-theme="dark"] {
  --bg-primary: #0D1117;
  --bg-secondary: #161B22;
  --bg-tertiary: #21262D;
  --bg-code: #161B22;

  --text-primary: #C9D1D9;
  --text-secondary: #8B949E;
  --text-muted: #6E7681;

  --accent-primary: #58A6FF;      /* Bright Blue */
  --accent-secondary: #79C0FF;    /* Light Blue */
  --accent-tertiary: #A5D6FF;     /* Pale Blue */
  --accent-hover: #1F6FEB;        /* Deep Blue */

  --border: #30363D;
  --success: #3FB950;
  --warning: #D29922;
  --error: #F85149;
  --info: #58A6FF;

  /* Syntax Highlighting */
  --syntax-keyword: #FF7B72;
  --syntax-string: #A5D6FF;
  --syntax-function: #D2A8FF;
  --syntax-comment: #8B949E;
  --syntax-number: #79C0FF;
}
```

### Typography
- **Code Font:** 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace
- **UI Font:** 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Base Size:** 14px, Line-height: 1.5
- **Code Size:** 13px, Line-height: 1.6

---

## COMPLETE FEATURE REQUIREMENTS

### FEATURE 1: CODE INPUT PANEL (Left Side, 45% width)
**Visual:**
- Clean textarea with line numbers in left gutter (muted gray, monospace)
- Language selector dropdown (auto-detects from extension, manual override available)
- Toolbar: Upload file (drag-and-drop), Clear, Copy, Format Code, Settings gear
- Mini-map on right side showing code overview (simplified, scrollable)
- Status bar at bottom: Line count, detected language, file size

**Behavior:**
- Syntax highlighting updates in real-time as user types
- Supports: Python, JavaScript, TypeScript, Java, C++, Go, Rust, C#, Ruby, PHP
- File upload accepts: .py, .js, .ts, .java, .cpp, .go, .rs, .cs, .rb, .php
- GitHub URL paste auto-fetches raw file content
- Drag-and-drop zone with visual feedback (border highlight on drag)

**States:**
- Empty: Placeholder text "Paste your code here, upload a file, or drop one in..." with subtle dashed border
- Loading: Spinner with "Analyzing code structure..." 
- Error: Red border with message "Unable to parse this file type"
- Active: Solid border, line numbers visible, syntax highlighted

### FEATURE 2: EXPLANATION PANEL (Right Side, 55% width)
**Visual:**
- Tab navigation: Overview | Step-by-Step | Variables | Complexity | Diagrams
- All tabs share a consistent card-based layout with 4px border-radius
- Cards have subtle left border accent (4px wide, accent-primary color)

**Tab: Overview**
- High-level summary (2-3 sentences max, large text)
- Difficulty badge: Beginner (green) / Intermediate (blue) / Advanced (amber)
- Key concepts used: horizontal row of pill-shaped tags (bg-tertiary, text-secondary)
- "Estimated read time: 3 min" in muted text
- "Overall Complexity" section with Time and Space badges

**Tab: Step-by-Step**
- Step controls bar at top: [Reset] [Step Back] [Play ▶] [Pause ⏸] [Step Forward] [To End]
- Speed selector: [0.5x] [1x] [2x] [4x] — pills, active one filled with accent
- Progress bar: thin line showing execution progress percentage
- Current step highlighted with left border accent
- Explanation card shows: Step number, Line number, What happens, Why it matters
- Variable changes shown inline with color coding (green for new, amber for modified, red for deleted)
- "Current State" mini-panel showing active variables

**Tab: Variables**
- Table: Name | Type | Current Value | Scope | Last Changed
- Visual representation for arrays: horizontal bar chart showing indices
- Visual representation for objects: nested tree view (collapsible)
- Visual representation for linked lists: connected node boxes
- Filter: All | Local | Global | Changed
- Search bar to find specific variables

**Tab: Complexity**
- Big-O badges prominently displayed: Time O(n²) | Space O(n)
- Explanation paragraph: "This is because the nested loop iterates n*n times..."
- Breakdown by section: each function/block with its own complexity
- Growth curve chart: simple line graph showing n vs operations for n=10,100,1000
- Comparison: "Better than O(n³) but worse than O(n log n)"
- Optimization suggestion card if applicable

**Tab: Diagrams**
- Flowchart: Mermaid.js or custom SVG showing execution flow
  - Start node (circle), process nodes (rectangles), decision diamonds, end node
  - Active path highlighted in accent color during step-through
- Sequence diagram: for function calls showing caller → callee relationships
- Class diagram: if OOP code detected (classes, inheritance, methods)
- Zoom controls: [−] [100%] [+] [Fit]
- Download diagram as PNG/SVG

### FEATURE 3: EXPLANATION DEPTH SWITCHER
**Visual:**
- Three-segment toggle at top of explanation panel
- Labels: "Beginner" | "Intermediate" | "Expert"
- Active segment filled with accent-primary, text white
- Inactive segments: bg-tertiary, text-secondary
- Smooth sliding animation between selections (300ms ease)

**Behavior:**
- Beginner: Plain English, analogies, no jargon. "This loop goes through each item one by one"
- Intermediate: Technical terms with inline definitions. "This for-loop has O(n) time complexity"
- Expert: Deep analysis, trade-offs, alternatives. "Using a for-loop here is optimal because..."
- Switching depth preserves scroll position and current step
- All three versions pre-generated so switching is instant

### FEATURE 4: INTERACTIVE ANNOTATIONS
**Visual:**
- Click any line number → opens inline annotation panel (slides out from left)
- Annotation panel: text area, save button, cancel button
- Saved annotations show as small dot indicator on line number (accent color)
- Hover dot → tooltip preview of annotation
- "Highlight & Explain" button in toolbar: select code → popup with instant explanation
- Question mark button on each line: marks as "confusing" for deeper explanation

**Behavior:**
- Annotations persist per session (localStorage)
- Export includes annotations as comments in generated docs
- "Ask AI" on any annotation: opens contextual chat about that specific line
- Confusing sections aggregated into "Common Confusions" sidebar widget

### FEATURE 5: THEME TOGGLE
**Visual:**
- Position: Top-right of header, next to settings
- Sun icon (☀) for light, Moon icon (☾) for dark
- Smooth 300ms CSS transition on ALL color changes (no jarring switches)
- System preference detection on first visit (prefers-color-scheme)
- Manual override saved to localStorage

**Behavior:**
- Transition affects: backgrounds, text, borders, accents, code highlighting, charts, diagrams
- No flash of unstyled content on theme switch
- Code editor theme syncs with app theme (Monaco/CodeMirror theme change)

### FEATURE 6: EXPORT & SHARE
**Visual:**
- Dropdown button: "Export" with chevron
- Options: Markdown, PDF, HTML (interactive), Share Link, Notion, GitHub Wiki
- Share modal: toggle for expiration (1 hour, 1 day, 7 days, never), copy link button
- Export progress indicator for large explanations

**Behavior:**
- Markdown: Clean .md file with code blocks and explanations
- PDF: Styled document with syntax highlighted code and formatted explanations
- HTML: Self-contained file with working step-through (offline capable)
- Share link: Unique URL, viewable without login, optional password
- Notion: Formatted for Notion import (headers, code blocks, callouts)

### FEATURE 7: COMPLEXITY ANALYSIS OVERLAY
**Visual:**
- Small floating panel (bottom-left of code panel, draggable)
- Shows: Time badge, Space badge, Cyclomatic complexity number
- Click to expand into full Complexity tab
- Color coding: Green (good), Amber (moderate), Red (poor)
- Updates in real-time as code changes

**Behavior:**
- Auto-calculated on code input (no button needed)
- Hover badge → tooltip explaining what it means
- "Optimize" button if complexity is high → suggests improved code
- Compares against best possible for this algorithm type

### FEATURE 8: RESPONSIVE DESIGN
**Breakpoints:**
- Desktop (>1024px): Side-by-side panels (45/55 split)
- Tablet (768-1024px): Collapsible panels, swipe between code and explanation
- Mobile (<768px): Stacked layout, code on top, explanation below, tab navigation

**Mobile Specific:**
- Bottom sheet for explanation panel (swipe up to expand)
- Floating action button for "Explain" (bottom-right)
- Simplified step controls (swipe left/right to step)
- Touch-friendly tap targets (min 44px)

---

## COMPONENT ARCHITECTURE

Build these components as reusable, well-structured React components with TypeScript:

### Layout Components
```
<AppLayout>
  <Header />
  <MainContent>
    <ResizableSplitPane left={CodePanel} right={ExplanationPanel} />
    <BottomPanel />
  </MainContent>
</AppLayout>
```

### Code Panel Components
```
<CodePanel>
  <CodeToolbar />
  <CodeEditor 
    value={code}
    language={detectedLang}
    onChange={handleCodeChange}
    lineNumbers={true}
    miniMap={true}
  />
  <CodeStatusBar />
</CodePanel>
```

### Explanation Panel Components
```
<ExplanationPanel>
  <DepthSwitcher 
    value={depth} 
    onChange={setDepth} 
    options={['beginner', 'intermediate', 'expert']}
  />
  <TabNavigation tabs={['Overview', 'Step-by-Step', 'Variables', 'Complexity', 'Diagrams']}>
    <OverviewTab explanation={explanation.overview} />
    <StepByStepTab 
      steps={explanation.steps}
      currentStep={currentStep}
      controls={stepControls}
      speed={playbackSpeed}
    />
    <VariablesTab variables={executionState.variables} />
    <ComplexityTab complexity={explanation.complexity} />
    <DiagramsTab diagrams={explanation.diagrams} />
  </TabNavigation>
</ExplanationPanel>
```

### Shared Components
```
<Card title={string} accent={boolean}>
  <CardHeader />
  <CardBody />
</Card>

<Badge type="success|warning|error|info|neutral" size="sm|md|lg">
  {text}
</Badge>

<Tooltip content={string} position="top|bottom|left|right">
  {children}
</Tooltip>

<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" icon={IconComponent}>
  {text}
</Button>

<IconButton icon={Icon} label={string} onClick={handler} />

<SlideOutPanel direction="left|right" isOpen={boolean} onClose={handler}>
  {content}
</SlideOutPanel>

<ProgressBar value={number} max={number} size="sm|md|lg" color="accent|success|warning|error" />
```

---

## STATE MANAGEMENT

Use Zustand for global state. Create these stores:

```typescript
// themeStore.ts
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}

// codeStore.ts
interface CodeState {
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  isAnalyzing: boolean;
  analysisError: string | null;
}

// explanationStore.ts
interface ExplanationState {
  explanation: Explanation | null;
  depth: 'beginner' | 'intermediate' | 'expert';
  setDepth: (depth: 'beginner' | 'intermediate' | 'expert') => void;
  currentStep: number;
  isPlaying: boolean;
  playbackSpeed: 0.5 | 1 | 2 | 4;
  stepForward: () => void;
  stepBackward: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: 0.5 | 1 | 2 | 4) => void;
}

// annotationStore.ts
interface AnnotationState {
  annotations: Record<number, string>; // lineNumber -> annotation
  confusingLines: number[];
  addAnnotation: (line: number, text: string) => void;
  removeAnnotation: (line: number) => void;
  markConfusing: (line: number) => void;
  unmarkConfusing: (line: number) => void;
}
```

---

## MOCK DATA FOR INITIAL DEVELOPMENT

Create this mock explanation so the UI is functional immediately without backend:

```typescript
const mockExplanation: Explanation = {
  summary: "This function implements binary search to find an element in a sorted array",
  difficulty: "intermediate",
  blocks: [
    {
      id: 1,
      line_start: 1,
      line_end: 2,
      type: "function",
      title: "Function Definition",
      beginner: "We create a function called 'search' that looks for a number in a list",
      intermediate: "Defines a function search that takes a sorted array nums and target value",
      expert: "Function signature uses TypeScript-style typing. Consider generic type T extends Comparable for flexibility",
      analogy: "Like a librarian finding a book using the Dewey Decimal system",
      key_concepts: ["function definition", "parameters"],
      variables_affected: ["nums", "target"]
    },
    {
      id: 2,
      line_start: 3,
      line_end: 4,
      type: "variable",
      title: "Initialize Pointers",
      beginner: "We set two markers at the start and end of our list",
      intermediate: "Initialize left and right pointers for the search boundaries",
      expert: "Two-pointer technique. left=0, right=length-1. Invariant: target in [left, right] if present",
      analogy: "Like placing bookmarks at the first and last page of a book",
      key_concepts: ["two pointers", "initialization"],
      variables_affected: ["left", "right"]
    },
    {
      id: 3,
      line_start: 5,
      line_end: 12,
      type: "loop",
      title: "Binary Search Loop",
      beginner: "We keep looking in the middle and cutting the search area in half",
      intermediate: "While loop continues while search space exists. Calculates mid, compares with target, adjusts pointers",
      expert: "Iterative binary search with O(log n) complexity. Note: mid calculation should use left + (right-left)/2 to prevent overflow in C++/Java",
      analogy: "Like finding a word in a dictionary by opening to the middle and deciding which half to keep",
      key_concepts: ["binary search", "while loop", "divide and conquer"],
      variables_affected: ["left", "right", "mid"]
    }
  ],
  overall_complexity: {
    time: "O(log n)",
    space: "O(1)",
    explanation: "Each iteration halves the search space. Only three integer variables regardless of input size."
  },
  patterns_detected: ["binary search", "two pointers", "divide and conquer"],
  potential_issues: [
    {
      severity: "warning",
      line: 7,
      description: "Integer overflow possible in C++/Java with (left + right) / 2",
      suggestion: "Use left + (right - left) / 2 for language-agnostic safety"
    }
  ],
  execution_steps: [
    { step: 1, line: 1, description: "Function called with nums=[1,3,5,7,9], target=5", state_changes: { nums: "[1,3,5,7,9]", target: "5" } },
    { step: 2, line: 3, description: "Initialize left pointer to 0", state_changes: { left: "0" } },
    { step: 3, line: 4, description: "Initialize right pointer to 4 (last index)", state_changes: { right: "4" } },
    { step: 4, line: 6, description: "Calculate middle index: (0+4)/2 = 2", state_changes: { mid: "2" } },
    { step: 5, line: 7, description: "Check if nums[2]=5 equals target=5", state_changes: {} },
    { step: 6, line: 8, description: "Match found! Return index 2", state_changes: { return: "2" } }
  ]
};
```

---

## ANIMATION & INTERACTION SPECIFICATIONS

### Transitions
- **Theme switch:** 300ms ease on all color properties, no flash
- **Tab switch:** 200ms fade + 150ms slide, content pre-loaded
- **Step change:** 400ms ease-out, current line highlight slides to new position
- **Panel resize:** Real-time with 16ms throttle, smooth drag
- **Card expand:** 250ms height animation with opacity fade
- **Modal open:** 200ms scale(0.95→1) + opacity, backdrop fade 150ms
- **Toast notification:** 300ms slide from top + 3s auto-dismiss

### Micro-interactions
- **Button hover:** Background darkens 10%, 150ms transition
- **Button active:** Scale 0.97, 100ms
- **Card hover:** Border color shifts to accent, subtle lift (translateY -2px)
- **Line highlight:** Left border accent animates width 0→4px, 200ms
- **Variable change:** Value text flashes accent color then settles, 600ms
- **Progress bar:** Smooth width transition, 100ms per update
- **Badge pulse:** Subtle opacity pulse on new badge appearance, 2s loop

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter` — Analyze/Explain code
- `Ctrl/Cmd + Shift + E` — Export
- `Space` — Play/Pause step-through
- `→` — Step forward
- `←` — Step backward
- `Home` — Reset to beginning
- `End` — Jump to end
- `1/2/3` — Switch depth (Beginner/Intermediate/Expert)
- `Ctrl/Cmd + D` — Toggle theme
- `Ctrl/Cmd + /` — Toggle annotation panel
- `Esc` — Close any modal/panel

---

## RESPONSIVE BEHAVIOR

### Desktop (>1024px)
- Split pane: 45% code / 55% explanation (resizable via drag handle)
- All features fully visible
- Hover tooltips enabled
- Keyboard shortcuts active

### Tablet (768-1024px)
- Split pane: 50/50 or stacked based on orientation
- Tab navigation collapses to icon-only if space constrained
- Touch-friendly controls (min 44px tap targets)
- Swipe gestures: left/right to switch between code and explanation panels

### Mobile (<768px)
- Single column: Code panel on top, explanation below (scrollable)
- Bottom sheet for explanation panel (swipe up to expand to full screen)
- Floating action button (FAB) for primary action (Explain)
- Simplified step controls: swipe left/right to step through
- Modal for settings, export, annotations
- Hamburger menu for navigation

---

## ACCESSIBILITY REQUIREMENTS

- All interactive elements must have focus indicators (2px solid accent-primary outline, 2px offset)
- ARIA labels on all icon buttons and non-text elements
- Screen reader announcements for step changes, analysis completion, errors
- Color contrast ratio minimum 4.5:1 for normal text, 3:1 for large text/UI
- Keyboard navigation fully functional (Tab order logical, Enter/Space activation)
- Reduced motion support: respect prefers-reduced-motion, disable animations
- Semantic HTML: proper heading hierarchy, landmarks (main, nav, complementary)
- Alt text for all diagrams with textual description fallback
- Skip links for keyboard users
- Dyslexia-friendly font option (OpenDyslexic) in settings
- Color-blind friendly mode: patterns/icons supplement color coding

---

## PERFORMANCE REQUIREMENTS

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Code editor load:** < 500ms after initial paint
- **Explanation generation:** Mock data instant, real API < 3s with loading state
- **Step-through animation:** 60fps, no jank
- **Theme switch:** < 100ms perceived
- **Bundle size:** < 200KB initial, code-split by route/feature
- **Lazy load:** Monaco editor, diagram library, export modules
- **Virtual scrolling:** For large code files (>1000 lines) and long variable lists

---

## ERROR HANDLING

### Code Input Errors
- **Invalid language:** "We don't support .xyz files yet. Supported: .py, .js, .ts..."
- **File too large:** "File exceeds 1MB limit. Try a smaller snippet."
- **Parse error:** "Could not understand this code. Check for syntax errors."
- **Network error (URL import):** "Could not fetch from URL. Check link and try again."

### Explanation Errors
- **AI timeout:** "Analysis taking longer than expected. Try a smaller code block."
- **Unsupported pattern:** "This code uses advanced features we can't fully explain yet."
- **Empty result:** "No explanation generated. Please try again."

### UI Errors
- **State inconsistency:** "Something went wrong. Resetting to last known state."
- **Export failure:** "Could not generate export. Try a different format."
- **Share link expired:** "This link has expired. Generate a new one."

**Error UI Pattern:**
- Inline errors: Red border + icon + message below field
- Toast errors: Top-right, auto-dismiss 5s, manual close X
- Full errors: Centered modal with retry button, error code for support
- All errors log to console with stack trace for debugging

---

## FILE STRUCTURE

```
code-explainer/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ResizableSplitPane.tsx
│   │   │   └── BottomPanel.tsx
│   │   ├── code/
│   │   │   ├── CodePanel.tsx
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── CodeToolbar.tsx
│   │   │   ├── CodeStatusBar.tsx
│   │   │   ├── LineNumbers.tsx
│   │   │   └── MiniMap.tsx
│   │   ├── explanation/
│   │   │   ├── ExplanationPanel.tsx
│   │   │   ├── DepthSwitcher.tsx
│   │   │   ├── OverviewTab.tsx
│   │   │   ├── StepByStepTab.tsx
│   │   │   ├── StepControls.tsx
│   │   │   ├── VariablesTab.tsx
│   │   │   ├── ComplexityTab.tsx
│   │   │   └── DiagramsTab.tsx
│   │   ├── shared/
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── SlideOutPanel.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── diagrams/
│   │       ├── Flowchart.tsx
│   │       ├── SequenceDiagram.tsx
│   │       └── ClassDiagram.tsx
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useCodeAnalysis.ts
│   │   ├── useExplanation.ts
│   │   ├── useStepThrough.ts
│   │   ├── useAnnotations.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── stores/
│   │   ├── themeStore.ts
│   │   ├── codeStore.ts
│   │   ├── explanationStore.ts
│   │   └── annotationStore.ts
│   ├── types/
│   │   ├── code.ts
│   │   ├── explanation.ts
│   │   └── ui.ts
│   ├── utils/
│   │   ├── languageDetector.ts
│   │   ├── complexityAnalyzer.ts
│   │   ├── syntaxHighlighter.ts
│   │   ├── exportGenerator.ts
│   │   └── animations.ts
│   ├── data/
│   │   └── mockExplanation.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.css
│   │   └── syntax.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## DEPENDENCIES

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "@monaco-editor/react": "^4.6.0",
    "mermaid": "^10.6.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "recharts": "^2.10.0",
    "jspdf": "^2.5.0",
    "html2canvas": "^1.4.0",
    "react-resizable-panels": "^0.0.55"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## BUILD INSTRUCTIONS FOR AI TOOL

1. **Initialize project:** Create React + TypeScript + Vite project
2. **Setup Tailwind:** Configure with custom color tokens in tailwind.config.js using CSS variables
3. **Create theme system:** Implement CSS variables + data-theme attribute + localStorage persistence
4. **Build layout:** AppLayout with Header, ResizableSplitPane, BottomPanel
5. **Build code panel:** Integrate Monaco Editor, add line numbers, syntax highlighting, toolbar, status bar
6. **Build explanation panel:** Tab system, all 5 tabs with mock data, depth switcher
7. **Build step-through:** Controls, progress bar, line highlighting sync, variable watch
8. **Build diagrams:** Integrate Mermaid.js for flowcharts, custom SVG for others
9. **Build annotations:** Click line → slide out panel, save to localStorage, dot indicators
10. **Build export:** Dropdown with format options, generate markdown/PDF/HTML
11. **Build theme toggle:** Sun/Moon icon, smooth transition, system preference detection
12. **Add keyboard shortcuts:** Custom hook for all shortcuts
13. **Add responsive:** Breakpoints, mobile layout, touch gestures
14. **Add accessibility:** Focus management, ARIA labels, screen reader support
15. **Add animations:** Framer Motion for all transitions, micro-interactions
16. **Polish:** Loading states, error handling, empty states, edge cases
17. **Test:** Verify all features, check responsive, validate accessibility

---

## FINAL INSTRUCTIONS

Generate a COMPLETE, production-ready single-page application. Every component must be fully implemented with:
- Real TypeScript types (no `any`)
- Proper error handling
- Loading states
- Empty states
- Responsive behavior
- Accessibility attributes
- Smooth animations
- The exact color palette specified above
- Mock data pre-loaded so the app works immediately
- All interactive features functional (step-through, annotations, theme toggle, export)

Do NOT use placeholder text like "Lorem ipsum" or "Content here". Use the mock data provided. Do NOT leave any TODO comments. Do NOT skip any feature listed above. The app should be immediately demoable upon generation.

The final output should be a complete, runnable React application with all files included.
