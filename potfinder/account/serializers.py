from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from members.models import EventParticipant
from members .serializers import EventParticipationSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class ProfileSerializer(serializers.ModelSerializer):
    # This nests the User data inside the Profile response
    user = UserSerializer(read_only=True) 
    participated_events = serializers.SerializerMethodField()

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
            "participated_events"
        ]

    def get_participated_events(self, obj):
        # Make sure EventParticipationSerializer is imported/defined
        qs = EventParticipant.objects.filter(user=obj.user)
        return EventParticipationSerializer(qs, many=True).data