"""Patch / updater delivery for the custom L2 launcher.

GET  /updater/files.xml  -> the bz2 patch manifest
POST /updater/download   -> form files="<relpath>.bz2" -> raw .bz2 stream
"""
import os

from fastapi import APIRouter, Form, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(prefix="/updater", tags=["updater"])

UPDATER_DIR = os.path.abspath(os.getenv("UPDATER_DIR", r"C:\Users\frank\Desktop\acis_fresh\clone_project\backend_service\updater"))


@router.get("/files.xml")
async def get_patch_manifest():
    manifest = os.path.join(UPDATER_DIR, "files.xml")
    if not os.path.isfile(manifest):
        raise HTTPException(status_code=404, detail="Patch manifest not found")
    return FileResponse(manifest, media_type="application/xml", filename="files.xml")


@router.post("/download")
async def download_patch(files: str = Form(...)):
    rel = files.strip().replace("\\", "/").lstrip("/")
    target = os.path.abspath(os.path.join(UPDATER_DIR, rel))
    # ponytail: guard against ../ traversal; only serve inside UPDATER_DIR
    if not target.startswith(UPDATER_DIR + os.sep) or not os.path.isfile(target):
        raise HTTPException(status_code=404, detail="Patch file not found")
    return FileResponse(target, media_type="application/octet-stream", filename=os.path.basename(target))
