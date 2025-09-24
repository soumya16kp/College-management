# members/models.py
from django.db import models
from django.contrib.auth.models import User
from clubs.models import Club   # assuming your club model is in clubs app

class Membership(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("president", "President"),
        ("secretary", "Secretary"),
        ("member", "Member"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="memberships")
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="memberships")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reason_for_leaving = models.TextField(blank=True, null=True)
    last_active = models.DateTimeField(auto_now=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "club")  # Prevent duplicate memberships

    def __str__(self):
        return f"{self.user.username} - {self.club.name} ({self.role}, {self.status})"
