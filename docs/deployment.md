# Deployment Guide

This document describes how to build, containerize, and deploy the CodeExplainer application stack.

## Frontend Build

The frontend builds as a static Single Page Application (SPA).

1. Change directory to frontend:
   ```bash
   cd frontend
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. The build output is generated under `frontend/dist/`. This static folder can be hosted on static platforms like Netlify, Vercel, AWS S3, or Nginx.

## Backend Deployment (Future)

The backend can be containerized using a Dockerfile:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000"]
```
