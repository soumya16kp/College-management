import os
import sys
from pathlib import Path
import django
from django.core.asgi import get_asgi_application

# Add outer folder so apps are found
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

# Set settings
settings_module = 'potfinder.deployment_setting' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'potfinder.potfinder.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(chat.routing.websocket_urlpatterns)
    ),
})
