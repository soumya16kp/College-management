import React, { useEffect, useState } from "react";
import { useMembers } from "../../context/MemberContext";

const AdminPage = ({ clubId }) => {
  const { fetchMembers, members, updateMemberRole, removeMember } = useMembers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        await fetchMembers(clubId);
      } catch (err) {
        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, [clubId, fetchMembers]);

  if (loading) return <p>Loading members...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Club Members (Admin Panel)</h2>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Change Role</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>{member.user.username}</td>
                <td>{member.user.profile?.designation || "-"}</td>
                <td>{member.role}</td>
                <td>
                  <select
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.id, e.target.value)}
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => removeMember(member.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
