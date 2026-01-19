from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/groups/<int:group_id>/', consumers.GroupChatConsumer.as_asgi()),
]