from rest_framework import serializers
from .models import Club, Event 
from members.models import Membership,EventParticipant


class EventSerializer(serializers.ModelSerializer):
    total_participants = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['club']

    def get_total_participants(self, obj):
        return obj.participants.count()


# --- serializer for Club (basic) ---

class ClubSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    coursol = serializers.ImageField(use_url=True, required=False)

    members_count = serializers.SerializerMethodField()
    events_count = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = [
            'id',
            'name',
            'tagline',
            'description',
            'image',
            'coursol',
            'schedule',
            'interest',
            'location',
            'members_count',
            'events_count',
            'founded',
        ]

    # 🔹 Total approved members
    def get_members_count(self, obj):
        return obj.memberships.filter(status='approved').count()

    # 🔹 Total events for this club
    def get_events_count(self, obj):
        return obj.events.count()



class ClubDetailSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'image', 'events']

class ClubMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ["id", "name"]

class EventMiniSerializer(serializers.ModelSerializer):
    club = ClubMiniSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ["id", "title", "date", "time", "club"]
