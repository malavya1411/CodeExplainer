# CodeExplainer Frontend Client

This is the interactive frontend single-page application (SPA) for CodeExplainer. It is powered by React 18, Vite, and Monaco Editor.

## Tech Stack
- **Framework**: React 18
- **Tooling**: Vite, PostCSS, Tailwind CSS
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Development Setup

### Prerequisite
Make sure you have Node.js (v18+) and npm installed on your machine.

### Installation
From this directory (`frontend/`), run:
```bash
npm install
```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
By default, the site is served on [http://localhost:5173](http://localhost:5173).

### Building for Production
To compile minified production assets:
```bash
npm run build
```
The compiled files will be output to the `dist/` directory.

### Code Style & Features
- **Auto-Language Detection**: The editor detects languages dynamically as you write.
- **Robust Storage**: App settings and annotations persist session-to-session in localStorage safely (with try/catch fallbacks).
- **Responsive Panels**: Built with `react-resizable-panels` to fit any viewport size.
