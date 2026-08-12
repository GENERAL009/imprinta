from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Service
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Service)


class ServiceCreate(BaseModel):
    title_uz: str
    title_ru: str
    title_en: str
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    icon: Optional[str] = None
    image: Optional[str] = None
    slug: str
    is_featured: bool = False
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    items = await crud.get_all(db, skip=skip, limit=limit, visible_only=True, search=search, search_fields=["title_uz", "title_ru", "title_en"])
    count = await crud.get_count(db, visible_only=True)
    return {"items": items, "total": count}


@router.get("/all")
async def list_all_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    items = await crud.get_all(db, skip=skip, limit=limit)
    count = await crud.get_count(db)
    return {"items": items, "total": count}


@router.get("/{slug}")
async def get_service(slug: str, db: AsyncSession = Depends(get_db)):
    item = await crud.get_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.post("")
async def create_service(data: ServiceCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_service(id: UUID, data: ServiceCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_service(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
