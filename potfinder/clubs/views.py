from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Club, Event
from .serializers import ClubSerializer, ClubDetailSerializer, EventSerializer


# GET all clubs OR POST a new club
@api_view(['GET', 'POST'])
def club_list(request):
    if request.method == 'GET':
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True)
        print(serializer.data)  
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
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def event_list(request, club_id):
    if request.method == 'GET':
        events = Event.objects.filter(club_id=club_id)
        serializer = EventSerializer(events, many=True)
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
        serializer = EventSerializer(event)
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
