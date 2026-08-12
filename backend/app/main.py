from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.ws_manager import ws_manager
from app.api.v1.router import api_router

app = FastAPI(
    title="ImPrinta API",
    description="ImPrinta Corporate Website API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

GALLERY_DIR = os.environ.get("GALLERY_DIR", "/app/gallery")
if os.path.isdir(GALLERY_DIR):
    app.mount("/gallery", StaticFiles(directory=GALLERY_DIR), name="gallery")

app.include_router(api_router, prefix="/api/v1")


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "ImPrinta API"}


@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
