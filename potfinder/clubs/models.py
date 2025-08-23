from django.db import models

class Club(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.URLField(blank=True, null=True)  # optional image URL

    def __str__(self):
        return self.name
