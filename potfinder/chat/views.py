from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import ChatGroup, Message
from .serializers import ChatGroupSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
from clubs.models import Club
from .permissions import is_club_member, is_club_admin_or_secretary
from django.contrib.auth.models import User

# list/create groups for club
@api_view(['GET', 'POST'])
def club_groups(request, club_id):
    club = get_object_or_404(Club, pk=club_id)

    if request.method == 'GET':
        groups = ChatGroup.objects.filter(club=club)
        serializer = ChatGroupSerializer(groups, many=True)
        return Response(serializer.data)

    # POST: create group — only admins/secretary/president allowed to create private or public groups
    if request.method == 'POST':
        if not is_club_admin_or_secretary(request.user, club):
            return Response({"detail":"Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        group = ChatGroup(name=data.get("name"), club=club, created_by=request.user, is_private=data.get("is_private", False))
        group.save()
        # add initial members if passed (list of user ids)
        members = data.get("members")  # expect list of ids
        if members:
            try:
                users = User.objects.filter(id__in=members)
                group.members.add(*users)
            except:
                pass
        # optionally add creator
        group.members.add(request.user)
        serializer = ChatGroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# add/remove members (admin/secretary)
@api_view(['POST','DELETE'])
def group_members_manage(request, group_id):
    group = get_object_or_404(ChatGroup, pk=group_id)
    if not is_club_admin_or_secretary(request.user, group.club):
        return Response({"detail":"Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST':
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        group.members.add(user)
        return Response({"detail":"Added"}, status=status.HTTP_200_OK)

    if request.method == 'DELETE':
        user_id = request.data.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        group.members.remove(user)
        return Response({"detail":"Removed"}, status=status.HTTP_200_OK)

# list messages in a group (pagination recommended)
@api_view(['GET','POST'])
@parser_classes([MultiPartParser, FormParser])  # allow file uploads
def group_messages(request, group_id):
    print("INCOMING MULTIPART DATA:", request.data)
    group = get_object_or_404(ChatGroup, pk=group_id)

    # permission: must be group member or public group
    if group.is_private and request.user not in group.members.all() and not is_club_admin_or_secretary(request.user, group.club):
        return Response({"detail":"Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        qs = group.messages.filter(deleted=False).order_by('created_at')
        serializer = MessageSerializer(qs, many=True)
        return Response(serializer.data)

    # POST: create message (supports file/image)
    if request.method == 'POST':
        data = request.data.copy()
        serializer = MessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save(group=group, sender=request.user)
            # Optionally broadcast via channels (consumer will handle real-time)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# pin/unpin message
@api_view(['POST'])
def pin_message(request, message_id):
    msg = get_object_or_404(Message, pk=message_id)
    # only admins in club or message sender or group creator can pin
    if not (request.user == msg.sender or is_club_admin_or_secretary(request.user, msg.group.club) or request.user == msg.group.created_by):
        return Response({"detail":"Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    msg.pinned = not msg.pinned
    msg.save()
    return Response({"pinned": msg.pinned})

# delete message (soft delete)
@api_view(['DELETE'])
def delete_message(request, message_id):
    msg = get_object_or_404(Message, pk=message_id)
    # allow sender or admin/secretary or group creator
    if not (request.user == msg.sender or is_club_admin_or_secretary(request.user, msg.group.club) or request.user == msg.group.created_by):
        return Response({"detail":"Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    msg.deleted = True
    msg.save()
    return Response(status=status.HTTP_204_NO_CONTENT)
