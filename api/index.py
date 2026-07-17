"""Vercel serverless entrypoint — imports the FastAPI app."""
import sys
import os

# Add backend_service to path so app.py, updater.py, downloads.py are found
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend_service"))

from app import app  # noqa: E402
