# 🚀 Deployment Configuration (Production)

This guide outlines the production deployment architecture and configuration for the **CodeExplainer** application stack.

## Hosting Architecture

Deploy the application using:

```text
Frontend  → Vercel
Backend   → Railway
Database  → Neon PostgreSQL
```

### Goals
* Zero frontend cold starts
* Fast global CDN delivery
* Low-latency API responses
* Production-ready environment
* Simple CI/CD from GitHub

---

## Frontend Deployment (Vercel)

### Requirements
Configure Vercel for the React + Vite frontend.

#### Build Settings
```yaml
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Environment Variables
```env
VITE_API_URL=https://api.your-domain.com
```
or
```env
VITE_API_URL=https://codeexplainer-production.up.railway.app
```

#### Create configuration
Create the file [frontend/vercel.json](file:///Users/malavyamankar/Codes/code-explainer-app/frontend/vercel.json):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures React Router works correctly.

---

## Backend Deployment (Railway)

Deploy FastAPI as a Railway Web Service.

### Root Directory
`backend`

### Start Command
```bash
gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:$PORT
```
Use the actual FastAPI entrypoint if different.
Examples:
```bash
gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```
or
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## Backend Dependencies

Ensure the following dependencies exist inside [backend/requirements.txt](file:///Users/malavyamankar/Codes/code-explainer-app/backend/requirements.txt):
```text
gunicorn
uvicorn
fastapi
python-dotenv
psycopg[binary]
sqlalchemy
alembic
```

---

## Railway Environment Variables
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGINS=https://your-vercel-domain.vercel.app
ENVIRONMENT=production
OPENAI_API_KEY=YOUR_KEY
```

---

## Database (Neon)

Use Neon PostgreSQL.

Required connection string:
```env
DATABASE_URL=postgresql+psycopg://...
```

Features:
* Serverless PostgreSQL
* Automatic scaling
* Branching support
* Railway compatible

---

## Production Folder Structure
```text
CodeExplainer/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   ├── Procfile
│   └── main.py
│
└── README.md
```

---

## Procfile (Railway)

Create the file [backend/Procfile](file:///Users/malavyamankar/Codes/code-explainer-app/backend/Procfile):
```procfile
web: gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```
Adjust the import path to match the project structure.

---

## CORS Configuration

FastAPI must allow the Vercel frontend:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## CI/CD

Requirements:
* Automatic deployment from GitHub
* Push to `main` triggers deployment
* Vercel auto-deploys frontend
* Railway auto-deploys backend
* Environment variables managed through dashboards
* No manual deployment steps required

---

## Expected Result
```text
https://codeexplainer.vercel.app
        │
        ▼
https://codeexplainer-api.up.railway.app
        │
        ▼
Neon PostgreSQL
```

Target performance:
* Frontend load: < 1 second
* No frontend cold starts
* API response: < 300ms typical
* Global CDN delivery
* Production-ready portfolio deployment
