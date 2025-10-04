import os
import sys
from pathlib import Path
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

# Add outer folder so apps are found
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

# Always point to your real settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.potfinder.settings')

django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(chat.routing.websocket_urlpatterns)
    ),
})
