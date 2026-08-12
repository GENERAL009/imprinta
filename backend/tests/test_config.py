import pytest

from app.core.config import Settings, settings


class TestSettings:
    def test_settings_has_secret_key(self):
        assert settings.SECRET_KEY is not None
        assert len(settings.SECRET_KEY) > 0

    def test_settings_algorithm(self):
        assert settings.ALGORITHM == "HS256"

    def test_settings_token_expiry(self):
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
        assert settings.REFRESH_TOKEN_EXPIRE_DAYS == 7

    def test_settings_postgres_config(self):
        assert settings.POSTGRES_USER is not None
        assert settings.POSTGRES_PASSWORD is not None
        assert settings.POSTGRES_DB is not None
        assert settings.POSTGRES_PORT == 5432

    def test_settings_cors_origins(self):
        assert isinstance(settings.BACKEND_CORS_ORIGINS, list)
        assert len(settings.BACKEND_CORS_ORIGINS) > 0

    def test_database_url_format(self):
        url = settings.database_url
        assert url.startswith("postgresql+asyncpg://")
        assert settings.POSTGRES_USER in url
        assert settings.POSTGRES_DB in url

    def test_settings_upload_dir(self):
        assert settings.UPLOAD_DIR is not None

    def test_settings_admin_credentials(self):
        assert settings.ADMIN_USERNAME is not None
        assert settings.ADMIN_PASSWORD is not None

    def test_settings_redis_url(self):
        assert settings.REDIS_URL.startswith("redis://")
