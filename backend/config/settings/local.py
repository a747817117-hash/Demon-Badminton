from .base import *

DEBUG = True

# Use SQLite for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True
