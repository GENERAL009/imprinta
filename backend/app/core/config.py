from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    SECRET_KEY: str = "imprinta-super-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    POSTGRES_USER: str = "imprinta"
    POSTGRES_PASSWORD: str = "imprinta_secure_2024"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "imprinta_db"

    REDIS_URL: str = "redis://redis:6379/0"
    UPLOAD_DIR: str = "/app/uploads"

    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]

    ADMIN_USERNAME: str = "imprinta"
    ADMIN_PASSWORD: str = "admin3322"

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
