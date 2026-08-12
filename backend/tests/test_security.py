import uuid
from datetime import timedelta

import pytest
from jose import jwt

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class TestPasswordHashing:
    def test_hash_and_verify_correct_password(self):
        password = "mysecurepassword"
        hashed = get_password_hash(password)
        assert hashed != password
        assert verify_password(password, hashed) is True

    def test_verify_wrong_password(self):
        hashed = get_password_hash("correctpassword")
        assert verify_password("wrongpassword", hashed) is False

    def test_hash_uniqueness(self):
        password = "samepassword"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        assert hash1 != hash2

    def test_empty_password(self):
        hashed = get_password_hash("")
        assert verify_password("", hashed) is True
        assert verify_password("notempty", hashed) is False


class TestTokenCreation:
    def test_create_access_token(self):
        user_id = str(uuid.uuid4())
        token = create_access_token(data={"sub": user_id})
        assert token is not None
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == user_id
        assert payload["type"] == "access"
        assert "exp" in payload

    def test_create_access_token_custom_expiry(self):
        user_id = str(uuid.uuid4())
        token = create_access_token(data={"sub": user_id}, expires_delta=timedelta(hours=2))
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == user_id

    def test_create_refresh_token(self):
        user_id = str(uuid.uuid4())
        token = create_refresh_token(data={"sub": user_id})
        assert token is not None
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["sub"] == user_id
        assert payload["type"] == "refresh"
        assert "exp" in payload

    def test_access_token_has_correct_type(self):
        token = create_access_token(data={"sub": "test"})
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["type"] == "access"

    def test_refresh_token_has_correct_type(self):
        token = create_refresh_token(data={"sub": "test"})
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        assert payload["type"] == "refresh"


class TestDecodeToken:
    def test_decode_valid_access_token(self):
        user_id = str(uuid.uuid4())
        token = create_access_token(data={"sub": user_id})
        payload = decode_token(token)
        assert payload["sub"] == user_id
        assert payload["type"] == "access"

    def test_decode_valid_refresh_token(self):
        user_id = str(uuid.uuid4())
        token = create_refresh_token(data={"sub": user_id})
        payload = decode_token(token)
        assert payload["sub"] == user_id
        assert payload["type"] == "refresh"

    def test_decode_invalid_token(self):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            decode_token("invalid.token.here")
        assert exc_info.value.status_code == 401

    def test_decode_tampered_token(self):
        from fastapi import HTTPException
        token = create_access_token(data={"sub": "user1"})
        tampered = token[:-5] + "xxxxx"
        with pytest.raises(HTTPException) as exc_info:
            decode_token(tampered)
        assert exc_info.value.status_code == 401
