from typing import Type, Optional, List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.models.base import BaseModel


class CRUDService:
    def __init__(self, model: Type[BaseModel]):
        self.model = model

    async def get_all(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        visible_only: bool = False,
        search: Optional[str] = None,
        search_fields: Optional[List[str]] = None,
    ):
        query = select(self.model).where(self.model.is_deleted == False)
        if visible_only:
            query = query.where(self.model.is_visible == True)
        if search and search_fields:
            conditions = []
            for field in search_fields:
                if hasattr(self.model, field):
                    conditions.append(getattr(self.model, field).ilike(f"%{search}%"))
            if conditions:
                from sqlalchemy import or_
                query = query.where(or_(*conditions))
        query = query.order_by(self.model.sort_order.asc(), self.model.created_at.desc())
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_count(self, db: AsyncSession, visible_only: bool = False) -> int:
        query = select(func.count()).select_from(self.model).where(self.model.is_deleted == False)
        if visible_only:
            query = query.where(self.model.is_visible == True)
        result = await db.execute(query)
        return result.scalar()

    async def get_by_id(self, db: AsyncSession, id: UUID):
        result = await db.execute(
            select(self.model).where(and_(self.model.id == id, self.model.is_deleted == False))
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, db: AsyncSession, slug: str):
        if not hasattr(self.model, "slug"):
            return None
        result = await db.execute(
            select(self.model).where(
                and_(self.model.slug == slug, self.model.is_deleted == False)
            )
        )
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, data: dict):
        obj = self.model(**data)
        db.add(obj)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, id: UUID, data: dict):
        obj = await self.get_by_id(db, id)
        if not obj:
            return None
        for key, value in data.items():
            if value is not None and hasattr(obj, key):
                setattr(obj, key, value)
        await db.flush()
        await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, id: UUID, soft: bool = True):
        obj = await self.get_by_id(db, id)
        if not obj:
            return False
        if soft:
            obj.is_deleted = True
            await db.flush()
        else:
            await db.delete(obj)
            await db.flush()
        return True
