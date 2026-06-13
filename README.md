# CodeExplainer Monorepo

Welcome to the **CodeExplainer** repository! This project is structured as a professional, production-grade monorepo containing the frontend client application, placeholder backend services, reusable static assets, and extensive documentation.

---

## Directory Structure

```text
code-explainer-app/
├── assets/                  # Media and graphical assets
│   ├── logo/                # Brand logo files
│   ├── screenshots/         # App flow screenshots
│   └── icons/               # Navigation & toolbar icon graphics
├── backend/                 # AI service and backend server API (Python)
│   ├── src/                 # Core server logic
│   ├── api/                 # Endpoint routing layer
│   ├── services/            # Explanation and AST analysis engines
│   ├── models/              # DB schemas & models
│   ├── requirements.txt     # Python server requirements
│   └── README.md            # Backend documentation
├── docs/                    # Architectural and developer documentation
│   ├── architecture.md      # Client-server communication & flow
│   ├── api.md               # API contracts & parameters reference
│   ├── deployment.md        # Static build & hosting configurations
│   └── screenshots/         # Walkthrough visuals
├── frontend/                # Interactive explanation SPA (Vite + React)
│   ├── src/                 # React source code components & stores
│   ├── public/              # Public asset folder (favicon, index.html assets)
│   ├── package.json         # Frontend Node package file
│   ├── vite.config.js       # Vite bundler options
│   ├── tailwind.config.js   # Style configurations
│   └── README.md            # Frontend setup guide
├── LICENSE                  # Open-source license terms (MIT)
├── .gitignore               # Main monorepo git ignored files list
└── README.md                # Root monorepo overview (this file)
```

---

## Getting Started

### 1. Frontend Client
The frontend is built with React 18, Vite, Tailwind CSS, and Monaco Editor.

To get started:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev

# Compile production-ready assets
npm run build
```
Once the dev server is running, open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend Services
The backend layout is structured and prepared for Python FastAPI integration.

To setup virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Architecture Overview
The system relies on an interactive client that detects languages locally and communicates with standard API services to generate code analyses. Detailed instructions are available in:
- [docs/architecture.md](file:///Users/malavyamankar/Codes/code-explainer-app/docs/architecture.md)
- [docs/api.md](file:///Users/malavyamankar/Codes/code-explainer-app/docs/api.md)
- [docs/deployment.md](file:///Users/malavyamankar/Codes/code-explainer-app/docs/deployment.md)

---

## License
This project is licensed under the terms of the MIT license. See the [LICENSE](file:///Users/malavyamankar/Codes/code-explainer-app/LICENSE) file for details.