from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import SeoMeta

router = APIRouter()


class SeoCreate(BaseModel):
    page: str
    title_uz: Optional[str] = None
    title_ru: Optional[str] = None
    title_en: Optional[str] = None
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    keywords: Optional[str] = None
    og_image: Optional[str] = None


@router.get("/{page}")
async def get_seo(page: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SeoMeta).where(SeoMeta.page == page))
    item = result.scalar_one_or_none()
    if not item:
        return {}
    return item


@router.get("")
async def list_seo(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(SeoMeta).where(SeoMeta.is_deleted == False))
    items = result.scalars().all()
    return {"items": items}


@router.put("")
async def upsert_seo(data: SeoCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(SeoMeta).where(SeoMeta.page == data.page))
    item = result.scalar_one_or_none()
    if item:
        for key, value in data.model_dump().items():
            if value is not None:
                setattr(item, key, value)
    else:
        item = SeoMeta(**data.model_dump())
        db.add(item)
    await db.flush()
    return {"detail": "Updated"}
