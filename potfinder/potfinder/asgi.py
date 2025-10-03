import sys
import os
from pathlib import Path
import django
from django.core.asgi import get_asgi_application

# Add outer folder to path so apps can be found
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chat.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
