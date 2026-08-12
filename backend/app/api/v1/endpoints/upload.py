import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from PIL import Image
import aiofiles

from app.core.config import settings
from app.core.security import get_current_user

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("")
async def upload_file(file: UploadFile = File(...), _=Depends(get_current_user)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type {ext} not allowed")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    if ext in {".jpg", ".jpeg", ".png", ".webp"}:
        try:
            img = Image.open(filepath)
            webp_filename = f"{uuid.uuid4().hex}.webp"
            webp_path = os.path.join(settings.UPLOAD_DIR, webp_filename)
            img.save(webp_path, "WEBP", quality=85)
            return {"url": f"/uploads/{filename}", "webp_url": f"/uploads/{webp_filename}", "filename": filename}
        except Exception:
            pass

    return {"url": f"/uploads/{filename}", "filename": filename}


@router.post("/multiple")
async def upload_multiple(files: list[UploadFile] = File(...), _=Depends(get_current_user)):
    results = []
    for file in files:
        if not file.filename:
            continue
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            continue
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(settings.UPLOAD_DIR, filename)
        async with aiofiles.open(filepath, "wb") as f:
            await f.write(content)
        results.append({"url": f"/uploads/{filename}", "filename": filename})
    return {"files": results}
