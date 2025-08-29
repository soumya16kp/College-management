from django.db import models
from clubs.models import Event  

class Gallery(models.Model):
    event = models.ForeignKey(Event, related_name="galleries", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="event_gallery/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.event.title}"
