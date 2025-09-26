from members.models import Membership

def is_club_member(user, club):
    return Membership.objects.filter(user=user, club=club, status='approved').exists()

def is_club_admin_or_secretary(user, club):
    return Membership.objects.filter(user=user, club=club, status='approved', role__in=['admin','secretary','president']).exists()
