from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.club_list, name="club-list"),
    path("<int:pk>/", views.club_detail, name="club-detail"),
    path("<int:club_id>/events/", views.event_list, name="event-list"),
    path("events/<int:pk>/", views.event_detail, name="event-detail"),
    path("events/", views.all_event, name="all-event"),
 
]

