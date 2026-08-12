from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import Client
from app.services.crud import CRUDService

router = APIRouter()
crud = CRUDService(Client)


class ClientCreate(BaseModel):
    name: str
    logo: Optional[str] = None
    website: Optional[str] = None
    is_partner: bool = False
    sort_order: int = 0
    is_visible: bool = True


@router.get("")
async def list_clients(db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    return {"items": items}


@router.get("/all")
async def list_all_clients(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    items = await crud.get_all(db, visible_only=False)
    return {"items": items}


@router.get("/partners")
async def list_partners(db: AsyncSession = Depends(get_db)):
    items = await crud.get_all(db, visible_only=True)
    partners = [i for i in items if i.is_partner]
    return {"items": partners}


@router.post("")
async def create_client(data: ClientCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await crud.create(db, data.model_dump())


@router.put("/{id}")
async def update_client(id: UUID, data: ClientCreate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    item = await crud.update(db, id, data.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    return item


@router.delete("/{id}")
async def delete_client(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    success = await crud.delete(db, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}
