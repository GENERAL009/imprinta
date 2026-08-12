from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Gallery
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Gallery)


class GalleryCreate(BaseModel):
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    image: str
    category: Optional[str] = None
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_gallery(db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    return {"items": items}


@router.post("")
async def create_gallery(data: GalleryCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_gallery(id: UUID, data: GalleryCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_gallery(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
