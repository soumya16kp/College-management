from rest_framework import serializers
from .models import Club, Event


# --- serializer for Event ---
class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = '__all__'


# --- serializer for Club (basic) ---

class ClubSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    coursol = serializers.ImageField(use_url=True, required=False)

    class Meta:
        model = Club
        fields = ['id', 'name', 'tagline','description', 'image', 'coursol','schedule','interest','location']

# --- serializer for Club with related events ---
class ClubDetailSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'image', 'events']
