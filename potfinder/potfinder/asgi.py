import os
import sys
from pathlib import Path 
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
sys.path.append(str(Path(__file__).resolve().parent.parent))
# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potfinder.potfinder.settings')  # ✅ Correct

# Standard Django ASGI application
django_asgi_app = get_asgi_application()

# Import routing from apps that have websocket consumers
import chat.routing

# Combine all websocket URL patterns
websocket_urlpatterns = []
for module in [chat.routing]:  # add other apps if needed in the future
    if hasattr(module, "websocket_urlpatterns"):
        websocket_urlpatterns += module.websocket_urlpatterns

# ASGI application
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
