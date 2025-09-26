from django.db import models

from django.db import models
from django.contrib.auth.models import User
from clubs.models import Club
from members.models import Membership  # your existing membership

class ChatGroup(models.Model):
    name = models.CharField(max_length=150)
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="chat_groups")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_chat_groups")
    is_private = models.BooleanField(default=False)
    members = models.ManyToManyField(User, related_name="chat_groups", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.club.name})"

class Message(models.Model):
    group = models.ForeignKey(ChatGroup, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="chat_files/", blank=True, null=True)
    image = models.ImageField(upload_to="chat_images/", blank=True, null=True)
    pinned = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Create your models here.
