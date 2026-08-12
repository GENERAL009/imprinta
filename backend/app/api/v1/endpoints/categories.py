from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Category
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Category)


class CategoryCreate(BaseModel):
    name_uz: str
    name_ru: str
    name_en: str
    slug: str
    type: str = "portfolio"
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_categories(type: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    if type:
        items = [i for i in items if i.type == type]
    return {"items": items}


@router.post("")
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_category(id: UUID, data: CategoryCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_category(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
