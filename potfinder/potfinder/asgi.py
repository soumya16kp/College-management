import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.settings')

# Standard Django ASGI application
django_asgi_app = get_asgi_application()

# Import routing from all apps that have websocket consumers
import chat.routing

# Combine all websocket URL patterns
websocket_urlpatterns = []
for module in [chat.routing, api.routing, clubs.routing, gallery.routing, members.routing]:
    if hasattr(module, "websocket_urlpatterns"):
        websocket_urlpatterns += module.websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
