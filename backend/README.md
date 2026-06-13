# CodeExplainer Backend

This directory houses the future backend API and AI services for CodeExplainer.

## Directory Structure

- `api/` - HTTP endpoints and routing layer (e.g., Flask/FastAPI routes).
- `models/` - Data schemas and database ORMs.
- `services/` - Core business logic, compiler parsing, and LLM explanation prompt engineering.
- `src/` - Core utility modules and initialization scripts.

## Getting Started

### Prerequisites
- Python 3.10+
- virtualenv or conda

### Installation
1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Development
To start the server (e.g., in a future Flask or FastAPI implementation):
```bash
python -m src.app
```
