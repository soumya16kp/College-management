from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from members.models import EventParticipant, Membership
from members.serializers import EventParticipationSerializer
from clubs.serializers import ClubMiniSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

class UserClubMembershipSerializer(serializers.ModelSerializer):
    club = ClubMiniSerializer(read_only=True)
    
    class Meta:
        model = Membership
        fields = ['id', 'club', 'role', 'status', 'date_joined']

class ProfileSerializer(serializers.ModelSerializer):
    # This nests the User data inside the Profile response
    user = UserSerializer(read_only=True) 
    participated_events = serializers.SerializerMethodField()
    joined_clubs = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        # Added all fields required by your React AccountPage and AccountForm
        fields = [
            "id", 
            "user", 
            "bio", 
            "phone", 
            "designation", 
            "profile_image", 
            "participated_events",
            "joined_clubs"
        ]

    def get_participated_events(self, obj):
        # Make sure EventParticipationSerializer is imported/defined
        qs = EventParticipant.objects.filter(user=obj.user)
        return EventParticipationSerializer(qs, many=True).data

    def get_joined_clubs(self, obj):
        memberships = Membership.objects.filter(user=obj.user).select_related('club')
        return UserClubMembershipSerializer(memberships, many=True).data