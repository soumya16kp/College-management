from django.urls import path
from .views import ClubMembersList, join_club, manage_membership, leave_club

urlpatterns = [
    path("clubs/<int:club_id>/members/", ClubMembersList.as_view(), name="club-members"),
    path("clubs/<int:club_id>/join/", join_club, name="join-club"),
    path("clubs/<int:club_id>/leave/", leave_club, name="leave-club"),
    path("members/<int:membership_id>/manage/", manage_membership, name="manage-membership"),
]
