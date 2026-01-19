from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Club, Event, Notice, EventPrize
from .serializers import ClubSerializer, ClubDetailSerializer, EventSerializer, NoticeSerializer
from account.models import Profile
from django.utils import timezone
from django.db.models import Count


# GET all clubs OR POST a new club
@api_view(['GET', 'POST'])
def club_list(request):
    if request.method == 'GET':
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ClubSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# GET single club, UPDATE, DELETE
@api_view(['GET', 'PUT', 'DELETE'])
def club_detail(request, pk):
    try:
        club = Club.objects.get(pk=pk)
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClubDetailSerializer(club)   
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ClubSerializer(club, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        club.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def all_event(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def event_list(request, club_id):
    if request.method == 'GET':
        events = Event.objects.filter(club_id=club_id)
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        data.pop("club", None)

        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            from .models import Club
            try:
                club = Club.objects.get(id=club_id)
                serializer.save(club=club)
            except Club.DoesNotExist:
                return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# GET single event, UPDATE, DELETE
@api_view(['GET', 'PUT', 'DELETE'])
def event_detail(request, pk):
    try:
        event = Event.objects.get(pk=pk)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
          
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_home_data(request):
    # Stats
    total_clubs = Club.objects.count()
    active_events = Event.objects.filter(date__gte=timezone.now().date()).count()
    total_students = Profile.objects.count()
    total_awards = EventPrize.objects.count()

    # Today's Highlights
    today = timezone.now().date()
    today_events = Event.objects.filter(date=today)
    today_events_serializer = EventSerializer(today_events, many=True, context={'request': request})

    # Notices
    notices = Notice.objects.all().order_by('-is_important', '-date_posted')[:5]
    notices_serializer = NoticeSerializer(notices, many=True)

    # Calendar Events (current month)
    from datetime import timedelta
    first_day_of_month = today.replace(day=1)
    if today.month == 12:
        last_day_of_month = today.replace(day=31)
    else:
        last_day_of_month = (first_day_of_month.replace(month=today.month + 1) - timedelta(days=1))
    
    calendar_events = Event.objects.filter(date__gte=first_day_of_month, date__lte=last_day_of_month)
    calendar_events_serializer = EventSerializer(calendar_events, many=True, context={'request': request})

    # Check permissions for notice creation
    can_create_notice = False
    if request.user.is_authenticated:
        if request.user.is_superuser:
            can_create_notice = True
        else:
            from members.models import Membership
            can_create_notice = Membership.objects.filter(
                user=request.user,
                status='approved',
                role__in=['admin', 'president']
            ).exists()

    return Response({
        "stats": {
            "total_clubs": total_clubs,
            "active_events": active_events,
            "total_students": total_students,
            "total_awards": total_awards,
        },
        "highlights": today_events_serializer.data,
        "notices": notices_serializer.data,
        "calendar_events": calendar_events_serializer.data,
        "can_create_notice": can_create_notice
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notice_list_create(request):
    """
    GET: List all notices
    POST: Create a new notice (admin/president only)
    """
    if request.method == 'GET':
        notices = Notice.objects.all().order_by('-is_important', '-date_posted')
        serializer = NoticeSerializer(notices, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Check if user is admin or president
        from members.models import Membership
        try:
            membership = Membership.objects.filter(
                user=request.user,
                status='approved',
                role__in=['admin', 'president']
            ).first()
            
            if not membership:
                return Response(
                    {"detail": "Only administrators and presidents can create notices"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = NoticeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def notice_detail(request, pk):
    """
    GET: Retrieve a notice
    PUT: Update a notice (admin/president only)
    DELETE: Delete a notice (admin/president only)
    """
    try:
        notice = Notice.objects.get(pk=pk)
    except Notice.DoesNotExist:
        return Response({"error": "Notice not found"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = NoticeSerializer(notice)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'DELETE']:
        # Check permissions
        from members.models import Membership
        try:
            membership = Membership.objects.filter(
                user=request.user,
                status='approved',
                role__in=['admin', 'president']
            ).first()
            
            if not membership:
                return Response(
                    {"detail": "Only administrators and presidents can modify notices"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'PUT':
            serializer = NoticeSerializer(notice, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            notice.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
