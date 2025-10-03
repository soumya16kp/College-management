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

# Set Django settings
settings_module = 'potfinder.deployment_setting' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'potfinder.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

application = get_wsgi_application()
