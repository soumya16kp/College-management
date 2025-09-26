from rest_framework import serializers
from .models import ChatGroup, Message
from django.contrib.auth.models import User

class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserLiteSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "group", "sender", "text", "file", "image", "pinned", "deleted", "created_at", "updated_at"]
        read_only_fields = ["sender","group", "created_at", "updated_at", "deleted"]

class ChatGroupSerializer(serializers.ModelSerializer):
    created_by = UserLiteSerializer(read_only=True)
    members = UserLiteSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatGroup
        fields = ["id", "name", "club", "created_by", "is_private", "members","messages", "created_at"]
        read_only_fields = ["created_by", "created_at"]
