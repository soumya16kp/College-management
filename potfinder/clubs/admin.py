from django.contrib import admin
from .models import Club, Event

class EventInline(admin.TabularInline): 
    model = Event
    extra = 1

class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'tagline', 'image', 'coursol')
    inlines = [EventInline]

class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "club", "date", "location")
    list_filter = ("club", "date")
    search_fields = ("title", "description", "location")

admin.site.register(Club, ClubAdmin)
admin.site.register(Event, EventAdmin)
