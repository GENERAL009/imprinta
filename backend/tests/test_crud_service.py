import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.services.crud import CRUDService
from app.models.content import Service, Portfolio, News


class TestCRUDServiceInit:
    def test_init_with_model(self):
        crud = CRUDService(Service)
        assert crud.model == Service

    def test_init_with_different_models(self):
        crud_portfolio = CRUDService(Portfolio)
        crud_news = CRUDService(News)
        assert crud_portfolio.model == Portfolio
        assert crud_news.model == News


class TestCRUDGetAll:
    @pytest.mark.asyncio
    async def test_get_all_returns_list(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_scalars = MagicMock()
        mock_scalars.all.return_value = [MagicMock(), MagicMock()]
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_all(mock_db)
        assert len(result) == 2

    @pytest.mark.asyncio
    async def test_get_all_with_pagination(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_scalars = MagicMock()
        mock_scalars.all.return_value = []
        mock_result.scalars.return_value = mock_scalars
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_all(mock_db, skip=10, limit=5)
        assert result == []


class TestCRUDGetCount:
    @pytest.mark.asyncio
    async def test_get_count(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar.return_value = 42
        mock_db.execute = AsyncMock(return_value=mock_result)

        count = await crud.get_count(mock_db)
        assert count == 42


class TestCRUDGetById:
    @pytest.mark.asyncio
    async def test_get_by_id_found(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_item = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_item
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_by_id(mock_db, uuid.uuid4())
        assert result == mock_item

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_by_id(mock_db, uuid.uuid4())
        assert result is None


class TestCRUDGetBySlug:
    @pytest.mark.asyncio
    async def test_get_by_slug_found(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_item = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_item
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_by_slug(mock_db, "test-slug")
        assert result == mock_item

    @pytest.mark.asyncio
    async def test_get_by_slug_not_found(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.get_by_slug(mock_db, "nonexistent")
        assert result is None


class TestCRUDCreate:
    @pytest.mark.asyncio
    async def test_create_item(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_db.add = MagicMock()
        mock_db.flush = AsyncMock()
        mock_db.refresh = AsyncMock()

        data = {
            "title_uz": "Test UZ",
            "title_ru": "Test RU",
            "title_en": "Test EN",
            "slug": "test-service",
        }
        result = await crud.create(mock_db, data)
        mock_db.add.assert_called_once()
        mock_db.flush.assert_called_once()
        mock_db.refresh.assert_called_once()


class TestCRUDUpdate:
    @pytest.mark.asyncio
    async def test_update_existing_item(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_item = MagicMock()
        mock_item.title_en = "Old Title"
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_item
        mock_db.execute = AsyncMock(return_value=mock_result)
        mock_db.flush = AsyncMock()
        mock_db.refresh = AsyncMock()

        result = await crud.update(mock_db, uuid.uuid4(), {"title_en": "New Title"})
        assert result is not None

    @pytest.mark.asyncio
    async def test_update_nonexistent_item(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.update(mock_db, uuid.uuid4(), {"title_en": "New Title"})
        assert result is None


class TestCRUDDelete:
    @pytest.mark.asyncio
    async def test_soft_delete(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_item = MagicMock()
        mock_item.is_deleted = False
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_item
        mock_db.execute = AsyncMock(return_value=mock_result)
        mock_db.flush = AsyncMock()

        result = await crud.delete(mock_db, uuid.uuid4(), soft=True)
        assert result is True
        assert mock_item.is_deleted is True

    @pytest.mark.asyncio
    async def test_hard_delete(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_item = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_item
        mock_db.execute = AsyncMock(return_value=mock_result)
        mock_db.flush = AsyncMock()
        mock_db.delete = AsyncMock()

        result = await crud.delete(mock_db, uuid.uuid4(), soft=False)
        assert result is True
        mock_db.delete.assert_called_once_with(mock_item)

    @pytest.mark.asyncio
    async def test_delete_nonexistent(self):
        crud = CRUDService(Service)
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=mock_result)

        result = await crud.delete(mock_db, uuid.uuid4())
        assert result is False
