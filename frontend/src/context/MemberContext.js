import { createContext, useContext, useState, useCallback } from "react";
import authService from "../services/authService";

const MemberContext = createContext();

export const useMembers = () => useContext(MemberContext);

export const MemberProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userMembership, setUserMembership] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMembers = useCallback(async (clubId) => {
    setLoading(true);
    try {
      const response = await authService.apiClient.get(`/clubs/${clubId}/members/`);
      const sortedMembers = response.data.sort((a, b) => {
        const roleWeights = { president: 4, admin: 3, secretary: 2, member: 1 };
        return roleWeights[b.role] - roleWeights[a.role];
      });
      setMembers(sortedMembers);
      
      const currentUser = await authService.getCurrentUser();
      const userMember = sortedMembers.find((m) => m.user.id === currentUser?.id);
      if (userMember) {
        setUserRole(userMember.role);
        setUserMembership(userMember);
      } else {
        setUserRole(null);
        setUserMembership(null);
      }

    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const joinClub = async (clubId) => {
    try {
      const response = await authService.apiClient.post(`/clubs/${clubId}/join/`);
      await fetchMembers(clubId);
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
      await fetchMembers(clubId);
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
      await fetchMembers(clubId);
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