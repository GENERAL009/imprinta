from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import News
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(News)


class NewsCreate(BaseModel):
    title_uz: str
    title_ru: str
    title_en: str
    content_uz: Optional[str] = None
    content_ru: Optional[str] = None
    content_en: Optional[str] = None
    excerpt_uz: Optional[str] = None
    excerpt_ru: Optional[str] = None
    excerpt_en: Optional[str] = None
    image: Optional[str] = None
    slug: str
    status: str = "published"
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_news(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    items = await crud.get_all(db, skip=skip, limit=limit, visible_only=True)
    count = await crud.get_count(db, visible_only=True)
    return {"items": items, "total": count}


@router.get("/{slug_or_id}")
async def get_news_item(slug_or_id: str, db: AsyncSession = Depends(get_db)):
    item = await crud.get_by_slug(db, slug_or_id)
    if not item:
        try:
            item = await crud.get_by_id(db, UUID(slug_or_id))
        except (ValueError, AttributeError):
            pass
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.post("")
async def create_news(data: NewsCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_news(id: UUID, data: NewsCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_news(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
