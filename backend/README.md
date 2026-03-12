# Today I... (Backend)

This is the FastAPI backend for the "Today I..." digital diary application. It handles user entries, skill extraction via AI, and tracks career growth over time using MongoDB.

## Prerequisites

- [Python](https://www.python.org/) 3.10+
- [Docker](https://www.docker.com/) (for running MongoDB locally)

## Getting Started

### 1. Database Setup (MongoDB)

The application requires a MongoDB instance. You can run one locally using Docker, exposing the default port `27017`:

```bash
docker run -d -p 27017:27017 --name today-i-mongo mongo:latest
```

### 2. Python Environment Setup

Navigate to the `backend` directory and set up a logical Python virtual environment:

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory (you can copy `.env.example` if it exists) and ensure the following variables are set:

```env
MONGODB_URL=mongodb://localhost:27017
SECRET_KEY=your_super_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=1440
# GEMINI_API_KEY=your_gemini_api_key_here # Optional: If missing, a mock AI service is used
```

### 4. Run the Development Server

Start the FastAPI application using `uvicorn`:

```bash
export PYTHONPATH=.
uvicorn app.main:app --reload --port 8000
```

The API will be accessible at `http://localhost:8000`. You can view the interactive API documentation (Swagger UI) at `http://localhost:8000/docs`.

## Project Structure

- `app/api/`: REST API route definitions.
- `app/models/`: Beanie/Motor ODM models for MongoDB documents.
- `app/services/`: Core logic, including the AI service for skill extraction.
- `app/core/`: Application configuration, database connection, and security utilities.
