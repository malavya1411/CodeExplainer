<p align="center">
  <img src="assets/logo/logo.png" alt="CodeExplainer Logo" width="180" />
</p>

<h1 align="center">CodeExplainer</h1>

<p align="center">
  <strong>Transform complex code into interactive explanations, visual walkthroughs, optimization insights, and learning-friendly documentation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-Fast%20Build-purple?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Monaco-Editor-green?style=for-the-badge&logo=visualstudiocode" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styled-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/AI-Powered-orange?style=for-the-badge" />
</p>

---

## 📖 Overview

CodeExplainer is an interactive code understanding platform designed to help developers, students, educators, and interview candidates understand code faster.

Instead of returning large blocks of AI-generated text, CodeExplainer transforms source code into:

- Visual explanations
- Step-by-step execution walkthroughs
- Complexity analysis
- Variable tracking
- Architecture diagrams
- Automatic documentation
- Optimization recommendations

The platform adapts explanations for different skill levels, making it useful for both beginners and experienced developers.

---

## ✨ Key Features

### 🧠 Interactive Code Explanation

- Multi-language code support
- AI-generated explanations
- Beginner, Intermediate, and Expert modes
- Logical code block breakdown
- Context-aware summaries

---

### 🔍 Step-by-Step Execution

Understand exactly how code runs.

Features include:

- Execution timeline
- Variable state tracking
- Loop visualization
- Conditional branch explanation
- Function call walkthroughs

---

### 📊 Complexity Analysis

Instant performance insights.

Includes:

- Time Complexity
- Space Complexity
- Bottleneck Detection
- Optimization Suggestions
- Performance Scoring

---

### ⚡ Code Optimizer

Generate improved implementations automatically.

Features:

- Before vs After comparison
- Code quality score
- Complexity improvements
- Maintainability analysis
- Performance recommendations

---

### 📝 Smart Comment Generator

Generate production-ready documentation.

Supports:

- Inline Comments
- Block Comments
- Docstrings
- Function Documentation
- Class Documentation

---

### 🌐 Visual Diagrams

Convert code into diagrams automatically.

Supported outputs:

- Flowcharts
- Logic Trees
- Execution Graphs
- Function Relationships
- Mermaid Diagrams

---

### 🎯 Variable Inspector

Track variables in real time.

Displays:

- Current values
- Scope visibility
- State transitions
- Mutation history

---

## 🏗️ System Architecture

```mermaid
flowchart LR

    User[Developer]

    Editor[Monaco Editor]

    Analysis[Code Analysis Engine]

    Explain[Explanation Generator]

    Optimize[Optimization Engine]

    Diagram[Diagram Generator]

    Comment[Comment Generator]

    UI[Interactive UI]

    User --> Editor

    Editor --> Analysis

    Analysis --> Explain
    Analysis --> Optimize
    Analysis --> Diagram
    Analysis --> Comment

    Explain --> UI
    Optimize --> UI
    Diagram --> UI
    Comment --> UI
