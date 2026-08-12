from sqlalchemy import Column, String, Boolean

from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="admin")
    is_active = Column(Boolean, default=True)
