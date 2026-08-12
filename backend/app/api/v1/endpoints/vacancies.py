from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Vacancy
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Vacancy)


class VacancyCreate(BaseModel):
    title_uz: str
    title_ru: str
    title_en: str
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    requirements_uz: Optional[str] = None
    requirements_ru: Optional[str] = None
    requirements_en: Optional[str] = None
    salary: Optional[str] = None
    location: Optional[str] = None
    type: str = "full-time"
    status: str = "published"
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_vacancies(db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    return {"items": items}


@router.post("")
async def create_vacancy(data: VacancyCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_vacancy(id: UUID, data: VacancyCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_vacancy(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
