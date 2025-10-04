"""
WSGI config for potfinder project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Add the outer project folder to the Python path
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

# Always point to the real settings file
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.potfinder.settings')

application = get_wsgi_application()
