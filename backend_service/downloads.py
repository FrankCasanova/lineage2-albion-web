"""Serve distributable downloads (launcher, etc.) to the web portal."""
import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/api/download", tags=["download"])

LAUNCHER_FILE = os.path.abspath(os.getenv(
    "LAUNCHER_FILE",
    r"C:\Users\frank\Desktop\acis_fresh\l2-launcher-custom\bin\Release\net8.0-windows\win-x64\publish\L2Launcher.exe",
))


@router.get("/launcher")
async def download_launcher():
    if not os.path.isfile(LAUNCHER_FILE):
        raise HTTPException(status_code=404, detail="Launcher build not found")
    return FileResponse(LAUNCHER_FILE, media_type="application/octet-stream", filename="L2Launcher.exe")
