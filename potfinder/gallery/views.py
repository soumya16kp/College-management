from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Gallery
from .serializers import GallerySerializer
from clubs.models import Event

class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer

    def get_queryset(self):

        queryset = super().get_queryset()
        event_id = self.request.query_params.get("event")
        club_id = self.request.query_params.get("club")

        if event_id:
            queryset = queryset.filter(event__id=event_id)
        if club_id:
            queryset = queryset.filter(event__club__id=club_id)

        return queryset

    @action(detail=False, methods=["get"], url_path="club/(?P<club_id>[^/.]+)")
    def by_club(self, request, club_id=None):
        """Return all galleries for a given club"""
        galleries = Gallery.objects.filter(event__club__id=club_id)
        serializer = self.get_serializer(galleries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="event/(?P<event_id>[^/.]+)")
    def by_event(self, request, event_id=None):
        """Return all galleries for a given event"""
        galleries = Gallery.objects.filter(event__id=event_id)
        serializer = self.get_serializer(galleries, many=True)
        return Response(serializer.data)
