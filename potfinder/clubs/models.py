from django.db import models

from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=200)
    tagline = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    interest = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    schedule = models.TextField(blank=True, null=True)

    image = models.ImageField(upload_to="club_images/", blank=True, null=True)
    coursol = models.ImageField(upload_to="club_carousel/", blank=True, null=True) 

    def __str__(self):
        return self.name


class Event(models.Model):
    club = models.ForeignKey(Club, related_name="events", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.title} ({self.club.name})"