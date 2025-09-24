from django.contrib import admin
from .models import Membership

class MembershipAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "club",
        "role",
        "status",
        "date_joined",
        "last_active",
    )
    list_filter = ("role", "status", "club")  # filters on right side
    search_fields = ("user__username", "user__email", "club__name")
    ordering = ("-date_joined",)
    readonly_fields = ("date_joined", "last_active")  # auto-generated, should not be editable

admin.site.register(Membership, MembershipAdmin)
