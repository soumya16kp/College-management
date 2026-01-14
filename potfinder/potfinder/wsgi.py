"""
WSGI config for potfinder project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
from pathlib import Path 
from django.core.wsgi import get_wsgi_application
sys.path.append(str(Path(__file__).resolve().parent.parent))
# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.potfinder.settings')  # ✅ Must match your folder structure

application = get_wsgi_application()
