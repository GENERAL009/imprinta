from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.content import SiteSettings

router = APIRouter()


class SettingUpdate(BaseModel):
    key: str
    value: Any
    type: str = "text"
    group: str = "general"


@router.get("")
async def get_all_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SiteSettings).where(SiteSettings.is_deleted == False))
    items = result.scalars().all()
    settings_dict = {}
    for item in items:
        settings_dict[item.key] = item.value
    return settings_dict


@router.get("/grouped")
async def get_grouped_settings(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(SiteSettings).where(SiteSettings.is_deleted == False))
    items = result.scalars().all()
    grouped = {}
    for item in items:
        group = item.group or "general"
        if group not in grouped:
            grouped[group] = []
        grouped[group].append({"key": item.key, "value": item.value, "type": item.type, "group": item.group})
    return grouped


@router.put("")
async def update_setting(data: SettingUpdate, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(SiteSettings).where(SiteSettings.key == data.key))
    setting = result.scalar_one_or_none()
    if setting:
        setting.value = data.value
        setting.type = data.type
        setting.group = data.group
    else:
        setting = SiteSettings(key=data.key, value=data.value, type=data.type, group=data.group)
        db.add(setting)
    await db.flush()
    return {"detail": "Updated", "key": data.key}


@router.put("/bulk")
async def bulk_update_settings(items: list[SettingUpdate], db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    for data in items:
        result = await db.execute(select(SiteSettings).where(SiteSettings.key == data.key))
        setting = result.scalar_one_or_none()
        if setting:
            setting.value = data.value
        else:
            setting = SiteSettings(key=data.key, value=data.value, type=data.type, group=data.group)
            db.add(setting)
    await db.flush()
    return {"detail": f"Updated {len(items)} settings"}
