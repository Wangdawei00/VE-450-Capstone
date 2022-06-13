"""Insta485 development configuration."""

import pathlib
import secrets

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
SECRET_KEY = secrets.token_bytes(24)
# SECRET_KEY = b'\xe7\xc1\xcaK\xa0Qd\xce\x8e\x10\xe3wo\x9b' \
#              b'\xdf{\xceC?\xad\xd4`=\x0c'
# SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
ASD_ROOT = pathlib.Path(__file__).resolve().parent.parent
# UPLOAD_FOLDER = INSTA485_ROOT / 'var' / 'uploads'
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
# MAX_CONTENT_LENGTH = 16 * 1024 * 1024
# Database file is var/insta485.sqlite3
DATABASE_FILENAME = ASD_ROOT / 'var' / 'asd.sqlite3'
