from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Club
from .serializers import ClubSerializer


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
        serializer = ClubSerializer(club)
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
