from rest_framework import serializers
from .models import Club, Event, EventTimeline, EventPrize, Notice
from members.models import Membership,EventParticipant


class EventTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTimeline
        fields = ['id', 'title', 'date', 'description', 'order']

class EventPrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPrize
        fields = ['id', 'prize_type', 'amount', 'description', 'icon']

class EventSerializer(serializers.ModelSerializer):
    total_participants = serializers.SerializerMethodField()
    user_registered = serializers.SerializerMethodField()
    timeline = EventTimelineSerializer(many=True, required=False)
    prizes = EventPrizeSerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['club']

    def create(self, validated_data):
        timeline_data = validated_data.pop('timeline', [])
        prizes_data = validated_data.pop('prizes', [])
        event = Event.objects.create(**validated_data)
        
        for item in timeline_data:
            EventTimeline.objects.create(event=event, **item)
            
        for item in prizes_data:
            EventPrize.objects.create(event=event, **item)
            
        return event

    def update(self, instance, validated_data):
        timeline_data = validated_data.pop('timeline', None)
        prizes_data = validated_data.pop('prizes', None)
        
        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update Timeline (Full Replace Strategy)
        if timeline_data is not None:
            instance.timeline.all().delete()
            for item in timeline_data:
                EventTimeline.objects.create(event=instance, **item)
                
        # Update Prizes (Full Replace Strategy)
        if prizes_data is not None:
            instance.prizes.all().delete()
            for item in prizes_data:
                EventPrize.objects.create(event=instance, **item)
                
        return instance

    def get_total_participants(self, obj):
        return obj.participants.count()

    def get_user_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(user=request.user).exists()
        return False


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
        fields = ['id', 'name', 'description', 'image', 'events','tagline','interest']

class ClubMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ["id", "name"]

class EventMiniSerializer(serializers.ModelSerializer):
    club = ClubMiniSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ["id", "title", "date", "time", "club"]

class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'
