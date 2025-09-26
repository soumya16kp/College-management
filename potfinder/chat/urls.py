from django.urls import path
from . import views

urlpatterns = [
    path('clubs/<int:club_id>/groups/', views.club_groups, name='club-groups'),
    path('groups/<int:group_id>/members/', views.group_members_manage, name='group-members-manage'),
    path('groups/<int:group_id>/messages/', views.group_messages, name='group-messages'),
    path('messages/<int:message_id>/pin/', views.pin_message, name='pin-message'),
    path('messages/<int:message_id>/', views.delete_message, name='delete-message'),
]
