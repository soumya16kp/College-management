"""
WSGI config for potfinder project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.settings')  # ✅ Must match your folder structure

application = get_wsgi_application()
