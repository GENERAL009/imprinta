from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.security import get_current_user
from app.core.ws_manager import ws_manager
from app.models.content import ContactMessage

router = APIRouter()


class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: Optional[str] = None
    attachment: Optional[str] = None


@router.post("")
async def submit_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    msg = ContactMessage(**data.model_dump())
    db.add(msg)
    await db.flush()
    await db.refresh(msg)

    await ws_manager.broadcast({
        "type": "new_message",
        "data": {
            "id": str(msg.id),
            "name": msg.name,
            "phone": msg.phone,
            "email": msg.email,
            "service": msg.service,
            "message": msg.message,
            "created_at": msg.created_at.isoformat() if msg.created_at else None,
        }
    })

    return {"detail": "Message sent successfully", "id": str(msg.id)}


@router.get("")
async def list_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    query = select(ContactMessage).where(ContactMessage.is_deleted == False)
    if status:
        query = query.where(ContactMessage.status == status)
    query = query.order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    count_q = select(func.count()).select_from(ContactMessage).where(ContactMessage.is_deleted == False)
    count_result = await db.execute(count_q)
    total = count_result.scalar()
    return {"items": items, "total": total}


@router.get("/unread-count")
async def unread_count(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(
        select(func.count()).select_from(ContactMessage).where(
            ContactMessage.is_deleted == False, ContactMessage.is_read == False
        )
    )
    return {"count": result.scalar()}


@router.put("/{id}/read")
async def mark_read(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    msg.is_read = True
    msg.status = "read"
    await db.flush()
    return {"detail": "Marked as read"}


@router.delete("/{id}")
async def delete_message(id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    result = await db.execute(select(ContactMessage).where(ContactMessage.id == id))
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Not found")
    msg.is_deleted = True
    await db.flush()
    return {"detail": "Deleted"}
