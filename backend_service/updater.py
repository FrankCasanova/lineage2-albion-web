"""Patch / updater delivery for the custom L2 launcher.

GET  /updater/files.xml  -> the bz2 patch manifest
POST /updater/download   -> form files="<relpath>.bz2" -> raw .bz2 stream
"""
import os

from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/updater", tags=["updater"])

def _resolve_updater_dir():
    env = os.getenv("UPDATER_DIR")
    if env and os.path.isdir(env):
        return os.path.abspath(env)

    candidates = [
        os.path.join(os.path.dirname(__file__), "updater"),
        os.path.join(os.path.dirname(__file__), "..", "backend_service", "updater"),
        os.path.join(os.getcwd(), "backend_service", "updater"),
        os.path.join(os.getcwd(), "updater"),
        os.path.join(os.getcwd(), "api", "updater"),
        os.path.join(os.path.dirname(__file__), "..", "api", "updater"),
    ]
    for c in candidates:
        if os.path.isdir(c):
            return os.path.abspath(c)
    return os.path.abspath(candidates[0])

UPDATER_DIR = _resolve_updater_dir()


@router.get("/files.xml")
async def get_patch_manifest():
    manifest = os.path.join(UPDATER_DIR, "files.xml")
    if not os.path.isfile(manifest):
        raise HTTPException(status_code=404, detail=f"Patch manifest not found at {manifest} (UPDATER_DIR={UPDATER_DIR})")
    return FileResponse(manifest, media_type="application/xml", filename="files.xml")


@router.post("/download")
async def download_patch(files: str = Form(...)):
    rel = files.strip().replace("\\", "/").lstrip("/")
    target = os.path.abspath(os.path.join(UPDATER_DIR, rel))
    # ponytail: guard against ../ traversal; only serve inside UPDATER_DIR
    if not target.startswith(UPDATER_DIR + os.sep) or not os.path.isfile(target):
        raise HTTPException(status_code=404, detail="Patch file not found")
    return FileResponse(target, media_type="application/octet-stream", filename=os.path.basename(target))
