import os

import pytest

from app.api.v1.endpoints.upload import ALLOWED_EXTENSIONS, MAX_FILE_SIZE


class TestUploadConfig:
    def test_allowed_extensions(self):
        assert ".jpg" in ALLOWED_EXTENSIONS
        assert ".jpeg" in ALLOWED_EXTENSIONS
        assert ".png" in ALLOWED_EXTENSIONS
        assert ".gif" in ALLOWED_EXTENSIONS
        assert ".webp" in ALLOWED_EXTENSIONS
        assert ".svg" in ALLOWED_EXTENSIONS
        assert ".pdf" in ALLOWED_EXTENSIONS
        assert ".doc" in ALLOWED_EXTENSIONS
        assert ".docx" in ALLOWED_EXTENSIONS

    def test_dangerous_extensions_not_allowed(self):
        assert ".exe" not in ALLOWED_EXTENSIONS
        assert ".bat" not in ALLOWED_EXTENSIONS
        assert ".sh" not in ALLOWED_EXTENSIONS
        assert ".py" not in ALLOWED_EXTENSIONS
        assert ".php" not in ALLOWED_EXTENSIONS
        assert ".js" not in ALLOWED_EXTENSIONS
        assert ".html" not in ALLOWED_EXTENSIONS

    def test_max_file_size(self):
        assert MAX_FILE_SIZE == 10 * 1024 * 1024  # 10MB
        assert MAX_FILE_SIZE > 0
