import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import get_db
from app.core.security import create_access_token


def make_mock_db(execute_side_effect=None, execute_return=None):
    mock_db = AsyncMock()
    if execute_side_effect:
        mock_db.execute = AsyncMock(side_effect=execute_side_effect)
    elif execute_return is not None:
        mock_db.execute = AsyncMock(return_value=execute_return)
    else:
        mock_db.execute = AsyncMock()
    mock_db.commit = AsyncMock()
    mock_db.rollback = AsyncMock()
    mock_db.close = AsyncMock()
    mock_db.flush = AsyncMock()
    mock_db.refresh = AsyncMock()
    mock_db.add = MagicMock()
    return mock_db


class TestServicesEndpoints:
    @pytest.mark.asyncio
    async def test_list_services_public(self):
        mock_result = MagicMock()
        mock_scalars = MagicMock()
        mock_scalars.all.return_value = []
        mock_result.scalars.return_value = mock_scalars

        mock_count_result = MagicMock()
        mock_count_result.scalar.return_value = 0

        mock_db = make_mock_db(execute_side_effect=[mock_result, mock_count_result])

        async def override_get_db():
            yield mock_db

        app.dependency_overrides[get_db] = override_get_db
        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get("/api/v1/services")
            assert response.status_code == 200
            data = response.json()
            assert "items" in data
            assert "total" in data
            assert data["total"] == 0
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_get_service_not_found(self):
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db = make_mock_db(execute_return=mock_result)

        async def override_get_db():
            yield mock_db

        app.dependency_overrides[get_db] = override_get_db
        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get("/api/v1/services/nonexistent-slug")
            assert response.status_code == 404
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_create_service_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/services", json={
                "title_uz": "Test",
                "title_ru": "Test",
                "title_en": "Test",
                "slug": "test"
            })
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_delete_service_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.delete(f"/api/v1/services/{uuid.uuid4()}")
        assert response.status_code in (401, 403)


class TestContactEndpoints:
    @pytest.mark.asyncio
    async def test_submit_contact_success(self):
        mock_db = make_mock_db()

        async def override_get_db():
            yield mock_db

        app.dependency_overrides[get_db] = override_get_db
        try:
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.post("/api/v1/contact", json={
                    "name": "John Doe",
                    "phone": "+998901234567",
                    "email": "john@example.com",
                    "message": "Hello!"
                })
            assert response.status_code == 200
        finally:
            app.dependency_overrides.clear()

    @pytest.mark.asyncio
    async def test_submit_contact_missing_required_fields(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/contact", json={
                "email": "john@example.com"
            })
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_list_contact_messages_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/contact")
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_unread_count_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/contact/unread-count")
        assert response.status_code in (401, 403)


class TestUploadEndpoints:
    @pytest.mark.asyncio
    async def test_upload_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/upload", files={
                "file": ("test.png", b"fake image content", "image/png")
            })
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_upload_multiple_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/upload/multiple", files=[
                ("files", ("test1.png", b"fake", "image/png")),
                ("files", ("test2.jpg", b"fake", "image/jpeg")),
            ])
        assert response.status_code in (401, 403)


class TestPortfolioEndpoints:
    @pytest.mark.asyncio
    async def test_create_portfolio_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/portfolio", json={
                "title_uz": "Test",
                "title_ru": "Test",
                "title_en": "Test",
                "slug": "test-portfolio"
            })
        assert response.status_code in (401, 403)

    @pytest.mark.asyncio
    async def test_delete_portfolio_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.delete(f"/api/v1/portfolio/{uuid.uuid4()}")
        assert response.status_code in (401, 403)


class TestNewsEndpoints:
    @pytest.mark.asyncio
    async def test_create_news_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/news", json={
                "title_uz": "Test",
                "title_ru": "Test",
                "title_en": "Test",
                "slug": "test-news"
            })
        assert response.status_code in (401, 403)


class TestFAQEndpoints:
    @pytest.mark.asyncio
    async def test_create_faq_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/faq", json={
                "question_uz": "Test?",
                "question_ru": "Test?",
                "question_en": "Test?",
                "answer_uz": "Javob",
                "answer_ru": "Ответ",
                "answer_en": "Answer"
            })
        assert response.status_code in (401, 403)


class TestGalleryEndpoints:
    @pytest.mark.asyncio
    async def test_create_gallery_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/gallery", json={
                "image": "/uploads/test.jpg"
            })
        assert response.status_code in (401, 403)


class TestVacanciesEndpoints:
    @pytest.mark.asyncio
    async def test_create_vacancy_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/vacancies", json={
                "title_uz": "Developer",
                "title_ru": "Разработчик",
                "title_en": "Developer"
            })
        assert response.status_code in (401, 403)


class TestCertificatesEndpoints:
    @pytest.mark.asyncio
    async def test_create_certificate_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/certificates", json={
                "title_uz": "ISO 9001",
                "title_ru": "ISO 9001",
                "title_en": "ISO 9001"
            })
        assert response.status_code in (401, 403)


class TestEmployeesEndpoints:
    @pytest.mark.asyncio
    async def test_create_employee_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/employees", json={
                "name_uz": "Ali",
                "name_ru": "Али",
                "name_en": "Ali"
            })
        assert response.status_code in (401, 403)


class TestClientsEndpoints:
    @pytest.mark.asyncio
    async def test_create_client_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/clients", json={
                "name": "Test Client",
                "website": "https://test.com"
            })
        assert response.status_code in (401, 403)


class TestTestimonialsEndpoints:
    @pytest.mark.asyncio
    async def test_create_testimonial_without_auth(self):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post("/api/v1/testimonials", json={
                "author_name": "John",
                "content_uz": "Ajoyib!",
                "content_ru": "Отлично!",
                "content_en": "Excellent!"
            })
        assert response.status_code in (401, 403)
