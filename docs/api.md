# API Reference

This document outlines the API contracts and communication protocol between the client and server.

## Endpoints

### 1. Explain Code
Analyze programming code snippets and return interactive explanations.

- **URL**: `/api/v1/explain`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "code": "function search(nums, target) { ... }",
    "language": "javascript",
    "depth": "intermediate"
  }
  ```

- **Success Response (200 OK)**:
  ```json
  {
    "summary": "Implements binary search in an array.",
    "difficulty": "intermediate",
    "estimatedReadMinutes": 3,
    "blocks": [
      {
        "id": 1,
        "line_start": 1,
        "line_end": 1,
        "type": "function",
        "title": "Function Definition",
        "intermediate": "Defines a function search that takes an array..."
      }
    ],
    "overall_complexity": {
      "time": "O(log n)",
      "space": "O(1)",
      "cyclomatic": 4
    }
  }
  ```

### 2. Supported Languages
Get list of all supported languages for syntax highlighting and explanation.

- **URL**: `/api/v1/languages`
- **Method**: `GET`
- **Response**:
  ```json
  [
    { "id": "python", "label": "Python" },
    { "id": "javascript", "label": "JavaScript" }
  ]
  ```
