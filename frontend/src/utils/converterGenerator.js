/**
 * converterGenerator.js
 * Client-side idiomatic code conversion engine.
 * Produces converted code + ConversionNotes for each language pair.
 */

import { SUPPORTED_LANGUAGES, detectLanguageFromContent } from "./languageDetector.js"

// ─── LANGUAGE PAIR CONVERSION RULES ───────────────────────────────────────────
// Each rule: { id, fromPattern, toReplacement, note: { from, to, reason } }

const PAIR_RULES = {
  "javascript→python": [
    {
      id: "const-let-decl",
      pattern: /\b(?:const|let|var)\s+(\w+)\s*=/g,
      replacement: (_, name) => `${name} =`,
      note: {
        from: "const name = ...",
        to: "name = ...",
        reason: "Python uses dynamic typing — no `const`, `let`, or `var` declarations needed.",
      },
    },
    {
      id: "arrow-fn",
      pattern: /(?:const|let)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g,
      replacement: (_, name, args) => `def ${name}(${args}):`,
      note: {
        from: "const fn = (args) => { ... }",
        to: "def fn(args):",
        reason: "Python uses `def` for function definitions. Arrow functions become named `def` blocks.",
      },
    },
    {
      id: "arrow-fn-implicit",
      pattern: /(?:const|let)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*([^{;\n]+)/g,
      replacement: (_, name, args, body) => `def ${name}(${args}):\n    return ${body.trim()}`,
      note: {
        from: "const fn = (x) => x * 2",
        to: "def fn(x):\n    return x * 2",
        reason: "Implicit return arrow functions become explicit `return` statements in Python.",
      },
    },
    {
      id: "function-decl",
      pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
      replacement: (_, name, args) => `def ${name}(${args}):`,
      note: {
        from: "function name(args) { ... }",
        to: "def name(args):",
        reason: "Python uses `def` keyword for all function declarations.",
      },
    },
    {
      id: "console-log",
      pattern: /console\.log\(/g,
      replacement: () => "print(",
      note: {
        from: "console.log(...)",
        to: "print(...)",
        reason: "`console.log` maps directly to Python's built-in `print()` function.",
      },
    },
    {
      id: "array-literal",
      pattern: /\[\]/g,
      replacement: () => "[]",
      note: {
        from: "const arr = []",
        to: "arr = []",
        reason: "Python lists use identical bracket syntax — just drop the declaration keyword.",
      },
    },
    {
      id: "strict-equality",
      pattern: /===/g,
      replacement: () => "==",
      note: {
        from: "a === b",
        to: "a == b",
        reason: "Python's `==` is always strict (no implicit coercion). No need for `===`.",
      },
    },
    {
      id: "strict-inequality",
      pattern: /!==/g,
      replacement: () => "!=",
      note: {
        from: "a !== b",
        to: "a != b",
        reason: "Python's `!=` is always strict. No need for `!==`.",
      },
    },
    {
      id: "logical-and",
      pattern: /\s&&\s/g,
      replacement: () => " and ",
      note: {
        from: "a && b",
        to: "a and b",
        reason: "Python uses English keywords `and`, `or`, `not` instead of `&&`, `||`, `!`.",
      },
    },
    {
      id: "logical-or",
      pattern: /\s\|\|\s/g,
      replacement: () => " or ",
      note: {
        from: "a || b",
        to: "a or b",
        reason: "Python uses `or` instead of `||`.",
      },
    },
    {
      id: "logical-not",
      pattern: /!\s*(\w)/g,
      replacement: (_, c) => `not ${c}`,
      note: {
        from: "!condition",
        to: "not condition",
        reason: "Python uses `not` instead of `!` for logical negation.",
      },
    },
    {
      id: "null-to-none",
      pattern: /\bnull\b/g,
      replacement: () => "None",
      note: {
        from: "null",
        to: "None",
        reason: "Python's equivalent of `null` is `None` (capital N).",
      },
    },
    {
      id: "undefined-to-none",
      pattern: /\bundefined\b/g,
      replacement: () => "None",
      note: {
        from: "undefined",
        to: "None",
        reason: "Python has no `undefined`. Use `None` or guard with `hasattr`.",
      },
    },
    {
      id: "true-false",
      pattern: /\b(true|false)\b/g,
      replacement: (_, kw) => kw[0].toUpperCase() + kw.slice(1),
      note: {
        from: "true / false",
        to: "True / False",
        reason: "Python boolean literals are capitalized: `True` and `False`.",
      },
    },
    {
      id: "for-of-loop",
      pattern: /for\s*\(\s*(?:const|let|var)\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g,
      replacement: (_, item, arr) => `for ${item} in ${arr}:`,
      note: {
        from: "for (const item of arr) { ... }",
        to: "for item in arr:",
        reason: "Python's `for…in` is the idiomatic equivalent — cleaner and more readable.",
      },
    },
    {
      id: "for-in-keys",
      pattern: /for\s*\(\s*(?:const|let|var)\s+(\w+)\s+in\s+(\w+)\s*\)\s*\{/g,
      replacement: (_, key, obj) => `for ${key} in ${obj}:`,
      note: {
        from: "for (const key in obj) { ... }",
        to: "for key in obj:",
        reason: "Iterating object keys in Python with `for key in dict` — same semantics.",
      },
    },
    {
      id: "for-i-loop",
      pattern: /for\s*\(\s*(?:let|var)\s+(\w+)\s*=\s*0;\s*\1\s*<\s*(\w+)\.length;\s*\1\+\+\s*\)\s*\{/g,
      replacement: (_, i, arr) => `for ${i}, _ in enumerate(${arr}):`,
      note: {
        from: "for (let i = 0; i < arr.length; i++)",
        to: "for i, _ in enumerate(arr):",
        reason: "Use `enumerate()` for index-based iteration — the idiomatic Python way.",
      },
    },
    {
      id: "push-to-append",
      pattern: /\.push\(/g,
      replacement: () => ".append(",
      note: {
        from: "arr.push(item)",
        to: "arr.append(item)",
        reason: "Python lists use `.append()` to add items — not `.push()`.",
      },
    },
    {
      id: "length-to-len",
      pattern: /(\w+)\.length/g,
      replacement: (_, v) => `len(${v})`,
      note: {
        from: "arr.length",
        to: "len(arr)",
        reason: "Python uses the built-in `len()` function — not a `.length` property.",
      },
    },
    {
      id: "template-literal",
      pattern: /`([^`]*)\${([^}]+)}([^`]*)`/g,
      replacement: (_, pre, expr, post) => `f"${pre}{${expr}}${post}"`,
      note: {
        from: "`Hello ${name}!`",
        to: 'f"Hello {name}!"',
        reason: "Python f-strings are the idiomatic equivalent of JS template literals.",
      },
    },
    {
      id: "object-literal",
      pattern: /\{\s*(\w+):\s*/g,
      replacement: (_, k) => `{"${k}": `,
      note: {
        from: "{ key: value }",
        to: '{ "key": value }',
        reason: "Python dictionaries require string keys. JS bare identifiers become quoted strings.",
      },
    },
    {
      id: "semicolons",
      pattern: /;(\s*\n)/g,
      replacement: (_, ws) => ws,
      note: {
        from: "statement;",
        to: "statement",
        reason: "Python does not use semicolons to terminate statements.",
      },
    },
    {
      id: "closing-braces",
      pattern: /^(\s*)}\s*$/gm,
      replacement: () => "",
      note: {
        from: "closing `}`",
        to: "(removed)",
        reason: "Python uses indentation instead of curly braces for block structure.",
      },
    },
    {
      id: "opening-brace",
      pattern: /\s*\{\s*$/gm,
      replacement: () => ":",
      note: {
        from: "opening `{`",
        to: "`:`",
        reason: "Python blocks open with a colon, not a curly brace.",
      },
    },
    {
      id: "return-type-annotation",
      pattern: /\):\s*\w+\s*\{/g,
      replacement: () => "):",
      note: {
        from: "function(): ReturnType {",
        to: "def function():",
        reason: "TypeScript return type annotations are removed (use docstrings or type hints separately).",
      },
    },
  ],

  "python→javascript": [
    {
      id: "def-to-function",
      pattern: /def\s+(\w+)\s*\(([^)]*)\):/g,
      replacement: (_, name, args) => `function ${name}(${args}) {`,
      note: {
        from: "def name(args):",
        to: "function name(args) {",
        reason: "JavaScript uses `function` keyword for function definitions.",
      },
    },
    {
      id: "print-to-console",
      pattern: /\bprint\(/g,
      replacement: () => "console.log(",
      note: {
        from: "print(...)",
        to: "console.log(...)",
        reason: "`print()` maps to `console.log()` in JavaScript.",
      },
    },
    {
      id: "none-to-null",
      pattern: /\bNone\b/g,
      replacement: () => "null",
      note: {
        from: "None",
        to: "null",
        reason: "JavaScript uses `null` where Python uses `None`.",
      },
    },
    {
      id: "true-false",
      pattern: /\b(True|False)\b/g,
      replacement: (_, kw) => kw.toLowerCase(),
      note: {
        from: "True / False",
        to: "true / false",
        reason: "JavaScript boolean literals are lowercase.",
      },
    },
    {
      id: "and-to-&&",
      pattern: /\s\band\b\s/g,
      replacement: () => " && ",
      note: {
        from: "a and b",
        to: "a && b",
        reason: "JavaScript uses `&&` instead of the English word `and`.",
      },
    },
    {
      id: "or-to-||",
      pattern: /\s\bor\b\s/g,
      replacement: () => " || ",
      note: {
        from: "a or b",
        to: "a || b",
        reason: "JavaScript uses `||` instead of the English word `or`.",
      },
    },
    {
      id: "not-to-!",
      pattern: /\bnot\s+(\w)/g,
      replacement: (_, c) => `!${c}`,
      note: {
        from: "not condition",
        to: "!condition",
        reason: "JavaScript uses `!` for logical negation.",
      },
    },
    {
      id: "for-in-to-forof",
      pattern: /for\s+(\w+)\s+in\s+(\w+):/g,
      replacement: (_, item, arr) => `for (const ${item} of ${arr}) {`,
      note: {
        from: "for item in arr:",
        to: "for (const item of arr) {",
        reason: "JavaScript uses `for...of` to iterate iterables idiomatically.",
      },
    },
    {
      id: "append-to-push",
      pattern: /\.append\(/g,
      replacement: () => ".push(",
      note: {
        from: "arr.append(item)",
        to: "arr.push(item)",
        reason: "JavaScript arrays use `.push()` to add items.",
      },
    },
    {
      id: "len-to-length",
      pattern: /len\((\w+)\)/g,
      replacement: (_, v) => `${v}.length`,
      note: {
        from: "len(arr)",
        to: "arr.length",
        reason: "JavaScript uses the `.length` property on arrays and strings.",
      },
    },
    {
      id: "fstring",
      pattern: /f"([^"]*)\{([^}]+)\}([^"]*)"/g,
      replacement: (_, pre, expr, post) => `\`${pre}\${${expr}}${post}\``,
      note: {
        from: 'f"Hello {name}!"',
        to: "`Hello ${name}!`",
        reason: "JavaScript template literals are the equivalent of Python f-strings.",
      },
    },
  ],

  "javascript→java": [
    {
      id: "function-to-method",
      pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
      replacement: (_, name, args) => `public static Object ${name}(${args.trim() ? args.split(",").map(a => `Object ${a.trim()}`).join(", ") : ""}) {`,
      note: {
        from: "function name(args) { ... }",
        to: "public static Object name(Object args) { ... }",
        reason: "Java requires explicit access modifiers, return types, and typed parameters.",
      },
    },
    {
      id: "const-to-final",
      pattern: /\bconst\s+(\w+)\s*=/g,
      replacement: (_, name) => `final var ${name} =`,
      note: {
        from: "const name = ...",
        to: "final var name = ...",
        reason: "Java uses `final` for immutable variables. `var` (Java 10+) infers the type.",
      },
    },
    {
      id: "let-to-var",
      pattern: /\blet\s+(\w+)\s*=/g,
      replacement: (_, name) => `var ${name} =`,
      note: {
        from: "let name = ...",
        to: "var name = ...",
        reason: "Java `var` (Java 10+) provides local type inference similar to `let`.",
      },
    },
    {
      id: "console-log",
      pattern: /console\.log\(/g,
      replacement: () => "System.out.println(",
      note: {
        from: "console.log(...)",
        to: "System.out.println(...)",
        reason: "Java's standard output method is `System.out.println()`.",
      },
    },
    {
      id: "null-check",
      pattern: /===\s*null/g,
      replacement: () => "== null",
      note: {
        from: "=== null",
        to: "== null",
        reason: "Java uses `==` for null comparison. Reference equality uses `==` for null checks.",
      },
    },
    {
      id: "push-to-add",
      pattern: /\.push\(/g,
      replacement: () => ".add(",
      note: {
        from: "arr.push(item)",
        to: "list.add(item)",
        reason: "Java `ArrayList` uses `.add()` instead of `.push()`.",
      },
    },
    {
      id: "length-prop",
      pattern: /(\w+)\.length\b/g,
      replacement: (_, v) => `${v}.length()`,
      note: {
        from: "str.length",
        to: "str.length()",
        reason: "In Java, `String.length()` is a method call, not a property.",
      },
    },
    {
      id: "true-false",
      pattern: /\b(true|false)\b/g,
      replacement: (_, kw) => kw,
      note: {
        from: "true / false",
        to: "true / false",
        reason: "Java boolean literals are already lowercase — no change needed.",
      },
    },
  ],

  "javascript→typescript": [
    {
      id: "const-typed",
      pattern: /\bconst\s+(\w+)\s*=\s*(\[)/g,
      replacement: (_, name, bracket) => `const ${name}: unknown[] = ${bracket}`,
      note: {
        from: "const arr = [...]",
        to: "const arr: unknown[] = [...]",
        reason: "TypeScript benefits from explicit array type annotations.",
      },
    },
    {
      id: "function-return-type",
      pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
      replacement: (_, name, args) => `function ${name}(${args}): void {`,
      note: {
        from: "function name(args) { ... }",
        to: "function name(args): void { ... }",
        reason: "TypeScript functions should have explicit return type annotations.",
      },
    },
    {
      id: "arrow-typed",
      pattern: /(?:const|let)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g,
      replacement: (_, name, args) => `const ${name} = (${args}): unknown =>`,
      note: {
        from: "const fn = (args) => ...",
        to: "const fn = (args): unknown => ...",
        reason: "TypeScript arrow functions benefit from explicit return type declarations.",
      },
    },
    {
      id: "let-any",
      pattern: /\blet\s+(\w+)\s*;/g,
      replacement: (_, name) => `let ${name}: unknown;`,
      note: {
        from: "let name;",
        to: "let name: unknown;",
        reason: "Uninitialized variables should have explicit type annotations in TypeScript.",
      },
    },
  ],

  "python→java": [
    {
      id: "def-to-method",
      pattern: /def\s+(\w+)\s*\(([^)]*)\):/g,
      replacement: (_, name, args) => {
        const typedArgs = args.trim() ? args.split(",").map(a => `Object ${a.trim()}`).join(", ") : ""
        return `public static Object ${name}(${typedArgs}) {`
      },
      note: {
        from: "def name(args):",
        to: "public static Object name(Object args) {",
        reason: "Java requires access modifiers, return types, and typed parameters.",
      },
    },
    {
      id: "print-to-sysout",
      pattern: /\bprint\(/g,
      replacement: () => "System.out.println(",
      note: {
        from: "print(...)",
        to: "System.out.println(...)",
        reason: "Java uses `System.out.println()` for console output.",
      },
    },
    {
      id: "none-to-null",
      pattern: /\bNone\b/g,
      replacement: () => "null",
      note: { from: "None", to: "null", reason: "Java uses `null` for the absence of a value." },
    },
    {
      id: "true-false",
      pattern: /\b(True|False)\b/g,
      replacement: (_, kw) => kw.toLowerCase(),
      note: { from: "True/False", to: "true/false", reason: "Java boolean literals are lowercase." },
    },
    {
      id: "append-to-add",
      pattern: /\.append\(/g,
      replacement: () => ".add(",
      note: { from: "list.append(x)", to: "list.add(x)", reason: "Java ArrayList uses `.add()`." },
    },
    {
      id: "len-to-size",
      pattern: /len\((\w+)\)/g,
      replacement: (_, v) => `${v}.size()`,
      note: { from: "len(lst)", to: "lst.size()", reason: "Java collections use `.size()` for length." },
    },
  ],

  "python→go": [
    {
      id: "def-to-func",
      pattern: /def\s+(\w+)\s*\(([^)]*)\):/g,
      replacement: (_, name, args) => `func ${name}(${args}) interface{} {`,
      note: {
        from: "def name(args):",
        to: "func name(args) interface{} {",
        reason: "Go uses `func` keyword. Return type is required; `interface{}` is the dynamic type equivalent.",
      },
    },
    {
      id: "print-to-fmt",
      pattern: /\bprint\(/g,
      replacement: () => "fmt.Println(",
      note: {
        from: "print(...)",
        to: "fmt.Println(...)",
        reason: "Go uses `fmt.Println()` from the `fmt` package for console output.",
      },
    },
    {
      id: "none-to-nil",
      pattern: /\bNone\b/g,
      replacement: () => "nil",
      note: { from: "None", to: "nil", reason: "Go uses `nil` for the absence of a value." },
    },
    {
      id: "true-false",
      pattern: /\b(True|False)\b/g,
      replacement: (_, kw) => kw.toLowerCase(),
      note: { from: "True/False", to: "true/false", reason: "Go boolean literals are lowercase." },
    },
    {
      id: "append-go",
      pattern: /(\w+)\.append\(([^)]+)\)/g,
      replacement: (_, arr, item) => `${arr} = append(${arr}, ${item})`,
      note: {
        from: "lst.append(x)",
        to: "lst = append(lst, x)",
        reason: "Go's built-in `append()` function returns a new slice — must be reassigned.",
      },
    },
    {
      id: "len-go",
      pattern: /len\((\w+)\)/g,
      replacement: (_, v) => `len(${v})`,
      note: { from: "len(x)", to: "len(x)", reason: "Go also uses `len()` — no change needed." },
    },
    {
      id: "for-in-go",
      pattern: /for\s+(\w+)\s+in\s+(\w+):/g,
      replacement: (_, item, arr) => `for _, ${item} := range ${arr} {`,
      note: {
        from: "for item in arr:",
        to: "for _, item := range arr {",
        reason: "Go uses `range` for iteration. `_` discards the index unless needed.",
      },
    },
  ],

  "javascript→go": [
    {
      id: "function-to-func",
      pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
      replacement: (_, name, args) => `func ${name}(${args}) interface{} {`,
      note: {
        from: "function name(args) {",
        to: "func name(args) interface{} {",
        reason: "Go uses `func`. All parameters and return types must be explicitly typed.",
      },
    },
    {
      id: "const-to-const",
      pattern: /\bconst\s+(\w+)\s*=/g,
      replacement: (_, name) => `${name} :=`,
      note: {
        from: "const name = ...",
        to: "name := ...",
        reason: "Go uses `:=` for short variable declarations with type inference.",
      },
    },
    {
      id: "console-log",
      pattern: /console\.log\(/g,
      replacement: () => "fmt.Println(",
      note: {
        from: "console.log(...)",
        to: "fmt.Println(...)",
        reason: "Go uses `fmt.Println()` from the standard `fmt` package.",
      },
    },
    {
      id: "null-to-nil",
      pattern: /\bnull\b/g,
      replacement: () => "nil",
      note: { from: "null", to: "nil", reason: "Go uses `nil` for zero values of pointer/slice/map/interface types." },
    },
    {
      id: "push-to-append",
      pattern: /(\w+)\.push\(([^)]+)\)/g,
      replacement: (_, arr, item) => `${arr} = append(${arr}, ${item})`,
      note: {
        from: "arr.push(item)",
        to: "arr = append(arr, item)",
        reason: "Go uses the built-in `append()` which returns a new slice.",
      },
    },
    {
      id: "length-to-len",
      pattern: /(\w+)\.length\b/g,
      replacement: (_, v) => `len(${v})`,
      note: {
        from: "arr.length",
        to: "len(arr)",
        reason: "Go uses the built-in `len()` function.",
      },
    },
    {
      id: "for-of-go",
      pattern: /for\s*\(\s*(?:const|let)\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g,
      replacement: (_, item, arr) => `for _, ${item} := range ${arr} {`,
      note: {
        from: "for (const item of arr) {",
        to: "for _, item := range arr {",
        reason: "Go uses `range` for iteration over slices and maps.",
      },
    },
  ],

  "javascript→rust": [
    {
      id: "const-to-let",
      pattern: /\bconst\s+(\w+)\s*=/g,
      replacement: (_, name) => `let ${name} =`,
      note: {
        from: "const name = ...",
        to: "let name = ...",
        reason: "Rust's `let` creates immutable bindings by default (equivalent to `const`).",
      },
    },
    {
      id: "let-to-let-mut",
      pattern: /\blet\s+(\w+)\s*=/g,
      replacement: (_, name) => `let mut ${name} =`,
      note: {
        from: "let name = ...",
        to: "let mut name = ...",
        reason: "Rust requires `mut` to make a variable mutable.",
      },
    },
    {
      id: "console-log",
      pattern: /console\.log\(([^)]+)\)/g,
      replacement: (_, args) => `println!("{:?}", ${args})`,
      note: {
        from: "console.log(x)",
        to: 'println!("{:?}", x)',
        reason: "Rust uses the `println!` macro for formatted output.",
      },
    },
    {
      id: "null-to-none",
      pattern: /\bnull\b/g,
      replacement: () => "None",
      note: {
        from: "null",
        to: "None",
        reason: "Rust uses `Option<T>` with `None` for the absence of a value — no null pointers.",
      },
    },
    {
      id: "function-decl",
      pattern: /function\s+(\w+)\s*\(([^)]*)\)\s*\{/g,
      replacement: (_, name, args) => `fn ${name}(${args}) {`,
      note: {
        from: "function name(args) {",
        to: "fn name(args) {",
        reason: "Rust uses `fn` for function declarations. Parameter types must be explicit.",
      },
    },
    {
      id: "push-vec",
      pattern: /\.push\(/g,
      replacement: () => ".push(",
      note: {
        from: "arr.push(x)",
        to: "vec.push(x)",
        reason: "Rust `Vec<T>` also uses `.push()` — but the variable must be `mut`.",
      },
    },
    {
      id: "length-to-len",
      pattern: /(\w+)\.length\b/g,
      replacement: (_, v) => `${v}.len()`,
      note: {
        from: "arr.length",
        to: "arr.len()",
        reason: "Rust uses `.len()` method for collection length.",
      },
    },
    {
      id: "for-of-rust",
      pattern: /for\s*\(\s*(?:const|let)\s+(\w+)\s+of\s+(\w+)\s*\)\s*\{/g,
      replacement: (_, item, arr) => `for ${item} in &${arr} {`,
      note: {
        from: "for (const item of arr) {",
        to: "for item in &arr {",
        reason: "Rust iterates with `for item in &collection`. `&` borrows the collection.",
      },
    },
  ],
}

// ─── PROGRESS STEPS ───────────────────────────────────────────────────────────
export const CONVERSION_PROGRESS_STEPS = [
  { id: "analyze",   label: "Analyzing Structure" },
  { id: "convert",   label: "Converting Logic" },
  { id: "idiomatic", label: "Generating Idiomatic Code" },
  { id: "validate",  label: "Validating Output" },
]

// ─── PRODUCTION-READY WRAPPERS ────────────────────────────────────────────────
function wrapProductionPython(code) {
  return `"""
Auto-converted to Python (Production Ready)
Add proper type hints, docstrings, and error handling below.
"""
from typing import Any, List, Optional


${code}
`
}

function wrapProductionJava(code) {
  return `import java.util.*;

/**
 * Auto-converted to Java (Production Ready)
 */
public class ConvertedCode {

${code.split("\n").map(l => "    " + l).join("\n")}

}
`
}

function wrapProductionGo(code) {
  return `package main

import (
\t"fmt"
\t"errors"
)

${code}

func main() {
\t// Entry point — call your converted functions here
}
`
}

function wrapProductionRust(code) {
  return `use std::error::Error;

${code}

fn main() -> Result<(), Box<dyn Error>> {
    // Entry point — call your converted functions here
    Ok(())
}
`
}

function wrapProductionTypeScript(code) {
  return `// Auto-converted to TypeScript (Production Ready)
// Add proper interfaces, generics, and strict types below.

${code}
`
}

function applyProductionWrapper(code, targetLang) {
  switch (targetLang) {
    case "python":     return wrapProductionPython(code)
    case "java":       return wrapProductionJava(code)
    case "go":         return wrapProductionGo(code)
    case "rust":       return wrapProductionRust(code)
    case "typescript": return wrapProductionTypeScript(code)
    default:           return code
  }
}

// ─── GENERIC FALLBACK CONVERSION ─────────────────────────────────────────────
function generateFallbackConversion(code, sourceLang, targetLang) {
  const sourceDef = SUPPORTED_LANGUAGES.find(l => l.id === sourceLang)
  const targetDef = SUPPORTED_LANGUAGES.find(l => l.id === targetLang)
  const sourceLabel = sourceDef?.label || sourceLang
  const targetLabel = targetDef?.label || targetLang

  return `// Converted from ${sourceLabel} to ${targetLabel}
// Note: Automatic conversion rules for this language pair are limited.
// The structure below preserves the original logic — manual idiom adjustments may be needed.

${code}
`
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
/**
 * runConversion(code, sourceLang, targetLang, options)
 * Returns { convertedCode, notes, detectedSourceLang }
 */
export function runConversion(code, sourceLang, targetLang, options = {}, conversionStyle = "idiomatic") {
  const {
    preserveComments = true,
    preserveVariableNames = true,
  } = options

  // Auto-detect source language
  const detectedSourceLang = sourceLang === "auto"
    ? detectLanguageFromContent(code)
    : sourceLang

  if (detectedSourceLang === targetLang) {
    return {
      convertedCode: code,
      notes: [{ id: "same-lang", from: `${detectedSourceLang}`, to: `${targetLang}`, reason: "Source and target languages are the same — no conversion needed." }],
      detectedSourceLang,
    }
  }

  const pairKey = `${detectedSourceLang}→${targetLang}`
  const rules = PAIR_RULES[pairKey] || []

  let convertedCode = code
  const appliedNotes = []

  // Strip / preserve block comments
  let strippedComments = []
  if (!preserveComments) {
    convertedCode = convertedCode.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")
  }

  // Apply each rule
  for (const rule of rules) {
    const before = convertedCode
    convertedCode = convertedCode.replace(rule.pattern, rule.replacement)
    if (convertedCode !== before) {
      appliedNotes.push({ id: rule.id, ...rule.note })
    }
  }

  // Fallback if no rules matched
  if (rules.length === 0) {
    convertedCode = generateFallbackConversion(code, detectedSourceLang, targetLang)
    appliedNotes.push({
      id: "fallback",
      from: `${detectedSourceLang} code`,
      to: `${targetLang} code`,
      reason: `Direct conversion rules for ${detectedSourceLang}→${targetLang} are not yet defined. Structure is preserved; manual idiomatic adjustments are recommended.`,
    })
  }

  // Production Ready: wrap with boilerplate
  if (conversionStyle === "production") {
    convertedCode = applyProductionWrapper(convertedCode, targetLang)
    appliedNotes.push({
      id: "production-wrapper",
      from: "bare code",
      to: "production boilerplate",
      reason: "Production mode adds module structure, imports, error handling scaffolding, and entry point.",
    })
  }

  // Limit notes to 10
  const notes = appliedNotes.slice(0, 10)

  return { convertedCode, notes, detectedSourceLang }
}

/**
 * Get all supported languages for the converter dropdowns.
 * Returns label and id.
 */
export function getConverterLanguages() {
  return SUPPORTED_LANGUAGES.map(l => ({ id: l.id, label: l.label }))
}
