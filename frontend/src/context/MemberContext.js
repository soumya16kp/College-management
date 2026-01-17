import { createContext, useContext, useState, useCallback } from "react";
import authService from "../services/authService";

export const roleWeights = { president: 4, admin: 3, secretary: 2, member: 1 };

const MemberContext = createContext();

export const useMembers = () => useContext(MemberContext);

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [memberCache, setMemberCache] = useState({}); // Cache: { clubId: { members: [], userRole, userMembership } }
  const [userRole, setUserRole] = useState(null);
  const [userMembership, setUserMembership] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async (clubId, forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && memberCache[clubId]) {
      const cached = memberCache[clubId];
      setMembers(cached.members);
      setUserRole(cached.userRole);
      setUserMembership(cached.userMembership);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.apiClient.get(`/clubs/${clubId}/members/`);
      const sortedMembers = response.data.sort((a, b) => {
        const roleWeights = { president: 4, admin: 3, secretary: 2, member: 1 };
        return roleWeights[b.role] - roleWeights[a.role];
      });

      const currentUser = await authService.getCurrentUser();
      // Ensure robust comparison by casting strings
      const userMember = sortedMembers.find((m) =>
        String(m.user.id) === String(currentUser?.id)
      );

      let role = null;
      let membership = null;

      if (userMember) {
        role = userMember.role;
        membership = userMember;
      }

      // Update state
      setMembers(sortedMembers);
      setUserRole(role);
      setUserMembership(membership);

      // Update Cache
      setMemberCache(prev => ({
        ...prev,
        [clubId]: {
          members: sortedMembers,
          userRole: role,
          userMembership: membership
        }
      }));

    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  }, [memberCache]);

  const joinClub = async (clubId) => {
    try {
      const response = await authService.apiClient.post(`/clubs/${clubId}/join/`);
      await fetchMembers(clubId, true); // Force refresh to update list and cache
      return response.data;
    } catch (err) {
      console.error("Failed to join club:", err);
      throw err;
    }
  };

  const manageMembership = async (membershipId, action, clubId, newRole = null) => {
    try {
      const data = newRole ? { action, new_role: newRole } : { action };
      const response = await authService.apiClient.patch(
        `/members/${membershipId}/manage/`,
        data
      );
      await fetchMembers(clubId, true); // Force refresh
      return response.data;
    } catch (err) {
      console.error("Failed to manage membership:", err);
      throw err;
    }
  };

  const leaveClub = async (clubId, reason = "") => {
    try {
      await authService.apiClient.delete(`/clubs/${clubId}/leave/`, {
        data: { reason }
      });
      setUserRole(null);
      setUserMembership(null);
      await fetchMembers(clubId, true); // Force refresh
    } catch (err) {
      console.error("Failed to leave club:", err);
      throw err;
    }
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        userRole,
        userMembership,
        loading,
        fetchMembers,
        joinClub,
        manageMembership,
        leaveClub
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};