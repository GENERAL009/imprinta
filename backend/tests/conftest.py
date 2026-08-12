import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.security import create_access_token, get_password_hash


@pytest.fixture
def fake_user():
    return {
        "id": uuid.uuid4(),
        "username": "testadmin",
        "email": "admin@test.com",
        "full_name": "Test Admin",
        "role": "admin",
        "is_active": True,
        "hashed_password": get_password_hash("testpass123"),
    }


@pytest.fixture
def auth_token(fake_user):
    return create_access_token(data={"sub": str(fake_user["id"])})


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def mock_db():
    db = AsyncMock()
    db.execute = AsyncMock()
    db.flush = AsyncMock()
    db.refresh = AsyncMock()
    db.add = MagicMock()
    db.commit = AsyncMock()
    db.rollback = AsyncMock()
    db.close = AsyncMock()
    return db
