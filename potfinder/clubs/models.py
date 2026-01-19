from django.db import models

from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=200)
    tagline = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    interest = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    schedule = models.TextField(blank=True, null=True)
    founded = models.DateTimeField(auto_now_add=True,null=True)  # automatically set when created
    image = models.ImageField(upload_to="club_images/", blank=True, null=True)
    coursol = models.ImageField(upload_to="club_carousel/", blank=True, null=True) 

    def __str__(self):
        return self.name


class Event(models.Model):
    EVENT_TYPE_CHOICES = [
        ('event', 'Event'),
        ('meeting', 'Club Meeting'),
        ('academic', 'Academic'),
        ('cultural', 'Cultural'),
    ]
    club = models.ForeignKey(Club, related_name="events", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)
    image = models.ImageField(upload_to="event_images/", blank=True, null=True)
    location = models.CharField(max_length=200, blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES, default='event')

    def __str__(self):
        return f"{self.title} ({self.club.name})"

class EventTimeline(models.Model):
    event = models.ForeignKey(Event, related_name="timeline", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    date = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['date', 'order']

    def __str__(self):
        return f"{self.title} - {self.event.title}"

class EventPrize(models.Model):
    event = models.ForeignKey(Event, related_name="prizes", on_delete=models.CASCADE)
    prize_type = models.CharField(max_length=100) # e.g. "Winner", "1st Runner Up"
    amount = models.CharField(max_length=100) # e.g. "₹10,000", "Goodies"
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=50, default="trophy") # For frontend icon mapping

    def __str__(self):
        return f"{self.prize_type} - {self.event.title}"

class Notice(models.Model):
    ROLE_CHOICES = [
        ('official', 'Official'),
        ('club', 'Club'),
        ('event', 'Event'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    is_important = models.BooleanField(default=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='official')

    def __str__(self):
        return self.title