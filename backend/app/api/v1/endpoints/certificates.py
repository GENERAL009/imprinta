from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Certificate
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Certificate)


class CertificateCreate(BaseModel):
    title_uz: str
    title_ru: str
    title_en: str
    image: Optional[str] = None
    issued_by: Optional[str] = None
    year: Optional[int] = None
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_certificates(db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    return {"items": items}


@router.post("")
async def create_certificate(data: CertificateCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_certificate(id: UUID, data: CertificateCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_certificate(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
