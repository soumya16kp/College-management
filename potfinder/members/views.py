from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Q
from .models import Membership
from .serializers import MemberSerializer, MembershipActionSerializer
from clubs.models import Club

class ClubMembersList(generics.ListAPIView):
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        club_id = self.kwargs["club_id"]
        return Membership.objects.filter(club_id=club_id).select_related('user', 'user__profile')

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def join_club(request, club_id):
    try:
        club = Club.objects.get(id=club_id)
        
        # Check if user already has a membership
        existing_membership = Membership.objects.filter(user=request.user, club=club).first()
        
        if existing_membership:
            if existing_membership.status == 'pending':
                return Response({"detail": "Membership request already pending"}, status=status.HTTP_400_BAD_REQUEST)
            elif existing_membership.status == 'approved':
                return Response({"detail": "Already a member of this club"}, status=status.HTTP_400_BAD_REQUEST)
            elif existing_membership.status == 'rejected':
                # Allow re-application if previously rejected
                existing_membership.status = 'pending'
                existing_membership.save()
                return Response(MemberSerializer(existing_membership).data, status=status.HTTP_200_OK)
        
        # Create new membership
        membership = Membership.objects.create(
            user=request.user,
            club=club,
            status="pending",
            role="member"
        )
        
        return Response(MemberSerializer(membership).data, status=status.HTTP_201_CREATED)
        
    except Club.DoesNotExist:
        return Response({"detail": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PATCH"])
@permission_classes([permissions.IsAuthenticated])
def manage_membership(request, membership_id):
    try:
        membership = Membership.objects.get(id=membership_id)
        serializer = MembershipActionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        action = serializer.validated_data['action']
        
        # Check if current user has permission to manage members
        current_user_membership = Membership.objects.filter(
            user=request.user, 
            club=membership.club, 
            status="approved"
        ).first()
        
        if not current_user_membership:
            return Response({"detail": "You are not a member of this club"}, status=status.HTTP_403_FORBIDDEN)
        
        # Role hierarchy: President > Admin > Secretary > Member
        role_hierarchy = {"president": 4, "admin": 3, "secretary": 2, "member": 1}
        current_user_weight = role_hierarchy.get(current_user_membership.role, 0)
        target_user_weight = role_hierarchy.get(membership.role, 0)
        
        # Can only manage users with lower or equal rank
        if target_user_weight > current_user_weight:
            return Response({"detail": "Cannot manage users with higher role"}, status=status.HTTP_403_FORBIDDEN)
        
        if action == "approve":
            if current_user_membership.role not in ["admin", "president"]:
                return Response({"detail": "Only admins can approve members"}, status=status.HTTP_403_FORBIDDEN)
            membership.status = "approved"
            
        elif action == "reject":
            if current_user_membership.role not in ["admin", "president"]:
                return Response({"detail": "Only admins can reject members"}, status=status.HTTP_403_FORBIDDEN)
            membership.status = "rejected"
            
        elif action == "promote":
            if current_user_membership.role not in ["admin", "president"]:
                return Response({"detail": "Only admins can promote members"}, status=status.HTTP_403_FORBIDDEN)
            
            # Define promotion path
            promotion_path = {"member": "secretary", "secretary": "admin", "admin": "president"}
            new_role = promotion_path.get(membership.role)
            
            if new_role and role_hierarchy[new_role] <= current_user_weight:
                membership.role = new_role
            else:
                return Response({"detail": "Cannot promote to this role"}, status=status.HTTP_400_BAD_REQUEST)
                
        elif action == "demote":
            if current_user_membership.role not in ["admin", "president"]:
                return Response({"detail": "Only admins can demote members"}, status=status.HTTP_403_FORBIDDEN)
            
            # Define demotion path
            demotion_path = {"president": "admin", "admin": "secretary", "secretary": "member"}
            new_role = demotion_path.get(membership.role)
            
            if new_role:
                membership.role = new_role
            else:
                return Response({"detail": "Cannot demote this role"}, status=status.HTTP_400_BAD_REQUEST)
                
        elif action == "remove":
            if membership.role == "president" and current_user_membership.role != "president":
                return Response({"detail": "Only president can remove president"}, status=status.HTTP_403_FORBIDDEN)
            membership.delete()
            return Response({"detail": "Member removed"}, status=status.HTTP_204_NO_CONTENT)

        membership.save()
        return Response(MemberSerializer(membership).data)
        
    except Membership.DoesNotExist:
        return Response({"detail": "Membership not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def leave_club(request, club_id):
    try:
        membership = Membership.objects.get(user=request.user, club_id=club_id, status="approved")
        reason = request.data.get("reason", "")
        membership.reason_for_leaving = reason
        membership.save()
        membership.delete()
        return Response({"detail": "You have left the club"}, status=status.HTTP_204_NO_CONTENT)
        
    except Membership.DoesNotExist:
        return Response({"detail": "You are not an active member of this club"}, status=status.HTTP_400_BAD_REQUEST)