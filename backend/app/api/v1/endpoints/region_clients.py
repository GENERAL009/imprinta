from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import RegionClient, Client

router = APIRouter()


class RegionClientCreate(BaseModel):
    region_id: str
    client_id: UUID
    description_uz: Optional[str] = None
    description_ru: Optional[str] = None
    description_en: Optional[str] = None
    image: Optional[str] = None
    sort_order: int = 0
    is_visible: bool = True


def serialize_region_client(rc):
    data = {
        "id": str(rc.id),
        "region_id": rc.region_id,
        "client_id": str(rc.client_id),
        "description_uz": rc.description_uz,
        "description_ru": rc.description_ru,
        "description_en": rc.description_en,
        "image": rc.image,
        "sort_order": rc.sort_order,
        "is_visible": rc.is_visible,
        "created_at": rc.created_at.isoformat() if rc.created_at else None,
        "updated_at": rc.updated_at.isoformat() if rc.updated_at else None,
    }
    if rc.client:
        data["client"] = {
            "id": str(rc.client.id),
            "name": rc.client.name,
            "logo": rc.client.logo,
            "website": rc.client.website,
        }
    return data


@router.get("/by-region/{region_id}")
async def get_by_region(region_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RegionClient)
        .options(selectinload(RegionClient.client))
        .where(and_(
            RegionClient.region_id == region_id,
            RegionClient.is_deleted == False,
            RegionClient.is_visible == True,
        ))
        .order_by(RegionClient.sort_order.asc(), RegionClient.created_at.desc())
    )
    items = result.scalars().all()
    return {"items": [serialize_region_client(i) for i in items]}


@router.get("/all")
async def list_all(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(
        select(RegionClient)
        .options(selectinload(RegionClient.client))
        .where(RegionClient.is_deleted == False)
        .order_by(RegionClient.sort_order.asc(), RegionClient.created_at.desc())
    )
    items = result.scalars().all()
    return {"items": [serialize_region_client(i) for i in items]}


@router.post("")
async def create_region_client(
    data: RegionClientCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    obj = RegionClient(**data.model_dump())
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    result = await db.execute(
        select(RegionClient)
        .options(selectinload(RegionClient.client))
        .where(RegionClient.id == obj.id)
    )
    obj = result.scalar_one()
    return serialize_region_client(obj)


@router.put("/{id}")
async def update_region_client(
    id: UUID,
    data: RegionClientCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(RegionClient).where(and_(RegionClient.id == id, RegionClient.is_deleted == False))
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    for key, value in data.model_dump().items():
        if hasattr(obj, key):
            setattr(obj, key, value)
    await db.flush()
    await db.refresh(obj)
    result = await db.execute(
        select(RegionClient)
        .options(selectinload(RegionClient.client))
        .where(RegionClient.id == obj.id)
    )
    obj = result.scalar_one()
    return serialize_region_client(obj)


@router.delete("/{id}")
async def delete_region_client(
    id: UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(RegionClient).where(and_(RegionClient.id == id, RegionClient.is_deleted == False))
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    obj.is_deleted = True
    await db.flush()
    return {"detail": "Deleted"}
