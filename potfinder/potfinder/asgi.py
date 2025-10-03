# potfinder/asgi.py
import os
import django
from django.core.asgi import get_asgi_application

settings_module = 'potfinder.deployment_setting' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'potfinder.settings';
# Set Django settings first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
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