# members/serializers.py
from rest_framework import serializers
from .models import Membership
from account.models import Profile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    phone = serializers.ReadOnlyField(source='profile.phone')
    designation = serializers.ReadOnlyField(source='profile.designation')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'designation']

class MemberSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Membership
        fields = ['id', 'user', 'user_id', 'club', 'role', 'status', 'date_joined', 'last_active', 'reason_for_leaving']
        read_only_fields = ['id', 'date_joined', 'last_active']

class MembershipActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject', 'promote', 'demote', 'remove'])
    new_role = serializers.ChoiceField(choices=Membership.ROLE_CHOICES, required=False)