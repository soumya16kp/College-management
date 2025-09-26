from django.contrib import admin
from .models import ChatGroup, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    fields = ("sender", "text", "file", "image", "pinned", "created_at")
    readonly_fields = ("created_at",)


@admin.register(ChatGroup)
class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "club", "created_by", "created_at")
    list_filter = ("club", "created_at")
    search_fields = ("name", "club__name", "created_by__username")
    filter_horizontal = ("members",)
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "group", "sender", "short_text", "pinned", "created_at")
    list_filter = ("pinned", "created_at", "group")
    search_fields = ("text", "sender__username", "group__name")

    def short_text(self, obj):
        return (obj.text[:30] + "...") if obj.text and len(obj.text) > 30 else obj.text
    short_text.short_description = "Message Preview"
