import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import get_db
from app.core.security import get_password_hash, create_access_token, create_refresh_token


def make_mock_db(execute_return=None):
    mock_db = AsyncMock()
    if execute_return is not None:
        mock_db.execute = AsyncMock(return_value=execute_return)
    mock_db.commit = AsyncMock()
    mock_db.rollback = AsyncMock()
    mock_db.close = AsyncMock()
    mock_db.flush = AsyncMock()
    mock_db.refresh = AsyncMock()
    mock_db.add = MagicMock()
    return mock_db


@pytest.mark.asyncio
async def test_login_success():
    user_id = uuid.uuid4()
    fake_user = MagicMock()
    fake_user.id = user_id
    fake_user.username = "imprinta"
    fake_user.hashed_password = get_password_hash("admin3322")
    fake_user.is_active = True

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = fake_user
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/login", json={
                "username": "imprinta",
                "password": "admin3322"
            })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_login_wrong_password():
    fake_user = MagicMock()
    fake_user.username = "imprinta"
    fake_user.hashed_password = get_password_hash("admin3322")
    fake_user.is_active = True

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = fake_user
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/login", json={
                "username": "imprinta",
                "password": "wrongpassword"
            })
        assert response.status_code == 401
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_login_user_not_found():
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/login", json={
                "username": "unknown",
                "password": "whatever"
            })
        assert response.status_code == 401
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_login_disabled_user():
    fake_user = MagicMock()
    fake_user.username = "disabled"
    fake_user.hashed_password = get_password_hash("pass123")
    fake_user.is_active = False

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = fake_user
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/login", json={
                "username": "disabled",
                "password": "pass123"
            })
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_login_missing_fields():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/auth/login", json={})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_me_without_token():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/auth/me")
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_me_with_valid_token():
    user_id = uuid.uuid4()
    fake_user = MagicMock()
    fake_user.id = user_id
    fake_user.username = "admin"
    fake_user.email = "admin@test.com"
    fake_user.full_name = "Admin User"
    fake_user.role = "admin"
    fake_user.is_active = True

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = fake_user
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        token = create_access_token(data={"sub": str(user_id)})
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/auth/me", headers={
                "Authorization": f"Bearer {token}"
            })
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "admin"
        assert data["role"] == "admin"
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_refresh_with_access_token_fails():
    token = create_access_token(data={"sub": str(uuid.uuid4())})

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/refresh", json={
                "refresh_token": token
            })
        assert response.status_code == 401
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_refresh_with_valid_refresh_token():
    user_id = uuid.uuid4()
    fake_user = MagicMock()
    fake_user.id = user_id
    fake_user.username = "admin"
    fake_user.is_active = True

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = fake_user
    mock_db = make_mock_db(mock_result)

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        refresh_token = create_refresh_token(data={"sub": str(user_id)})
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/auth/refresh", json={
                "refresh_token": refresh_token
            })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
    finally:
        app.dependency_overrides.clear()
