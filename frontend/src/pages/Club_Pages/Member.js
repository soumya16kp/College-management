import { useState, useEffect } from 'react';
import { useMembers } from '../../context/MemberContext'; 
import { useParams } from "react-router-dom";
import { FiMail, FiPhone, FiUsers, FiUser, FiUserCheck, FiUserX, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { MdGroups, MdAdminPanelSettings, MdPerson, MdEvent } from "react-icons/md";
import {FaCrown } from "react-icons/fa";
import "./Member.css";

const MembersPage = () => {
  const { id } = useParams();
  const { members, userRole, userMembership, loading, fetchMembers, joinClub, manageMembership, leaveClub } = useMembers();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMembers(id);
    }
  }, [id, fetchMembers]);

  const handleJoinClub = async () => {
    setActionLoading('join');
    try {
      await joinClub(id);
    } catch (error) {
      console.error("Failed to join club:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeaveRequest = () => {
    setShowLeaveModal(true);
  };

  const confirmLeave = async () => {
    setActionLoading('leave');
    try {
      await leaveClub(id, leaveReason);
      setShowLeaveModal(false);
      setLeaveReason('');
    } catch (error) {
      console.error("Failed to leave club:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMembershipAction = async (membershipId, action) => {
    setActionLoading(membershipId);
    try {
      await manageMembership(membershipId, action, id);
    } catch (error) {
      console.error(`Failed to ${action} membership:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'president': return <FaCrown />;
      case 'admin': return <MdAdminPanelSettings />;
      case 'secretary': return <MdEvent />;
      default: return <MdPerson />;
    }
  };

  const getInitials = (user) => {
    return `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.toUpperCase() || 
           user?.username?.[0]?.toUpperCase() || 'U';
  };

  const filteredMembers = members.filter(member => {
    if (filter === 'all') return true;
    if (filter === 'pending') return member.status === 'pending';
    if (filter === 'approved') return member.status === 'approved';
    if (filter === 'admins') return ['admin', 'president'].includes(member.role);
    if (filter === 'officers') return ['president', 'admin', 'secretary'].includes(member.role);
    return true;
  });

  const canManageMember = (targetMember) => {
    if (!userRole) return false;
    if (targetMember.user.id === userMembership?.user.id) return false;
    
    const roleHierarchy = { president: 4, admin: 3, secretary: 2, member: 1 };
    const userWeight = roleHierarchy[userRole] || 0;
    const targetWeight = roleHierarchy[targetMember.role] || 0;
    
    return userWeight >= targetWeight;
  };

  if (loading) return <div className="members-loading">Loading members...</div>;

  return (
    <div className="members-page-container">
      {/* Header */}
      <div className="members-page-header">
        <div className="members-page-header-content">
          <MdGroups className="members-page-header-icon" />
          <div>
            <h1>Club Members</h1>
            <p>Manage and connect with club members</p>
          </div>
        </div>
      </div>

      {/* Membership Status Section */}
      <div className="membership-status-section">
        <div className="membership-status-content">
          <div>
            <p className="membership-status-text">
              {userRole ? (
                <>You are currently a <span className="membership-role-badge">{userRole}</span> of this club</>
              ) : (
                "You are not a member of this club yet"
              )}
            </p>
          </div>
          {userRole ? (
            <button 
              className={`membership-action-btn leave-club-btn ${actionLoading === 'leave' ? 'loading' : ''}`}
              onClick={handleLeaveRequest}
              disabled={actionLoading}
            >
              <FiUserX className="members-btn-icon" />
              {actionLoading === 'leave' ? 'Leaving...' : 'Leave Club'}
            </button>
          ) : (
            <button 
              className={`membership-action-btn join-club-btn ${actionLoading === 'join' ? 'loading' : ''}`}
              onClick={handleJoinClub}
              disabled={actionLoading}
            >
              <FiUserCheck className="members-btn-icon" />
              {actionLoading === 'join' ? 'Joining...' : 'Join Club'}
            </button>
          )}
        </div>
      </div>

      {/* Members List with Filtering */}
      <div className="members-filter-section">
        <h2 className="members-filter-title">Members Directory</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="members-filter-select"
        >
          <option value="all">All Members</option>
          <option value="officers">Club Officers</option>
          <option value="admins">Admins & President</option>
          <option value="approved">Approved Members</option>
          <option value="pending">Pending Approval</option>
        </select>
      </div>

      {/* Members Grid */}
      <div className="members-grid">
        {filteredMembers.length === 0 ? (
          <div className="members-empty-state">
            <FiUsers className="members-empty-icon" />
            <h3>No Members Found</h3>
            <p>{filter === 'pending' ? 'No pending membership requests' : 'No members match your current filter'}</p>
          </div>
        ) : (
          filteredMembers.map(member => (
            <div key={member.id} className={`member-card ${member.role} ${member.status}`}>
              <div className="member-card-header">
                <div className="member-avatar">
                  {getInitials(member.user)}
                </div>
                <div className="member-info">
                  <h3 className="member-name">
                    {member.user.full_name || `${member.user.first_name} ${member.user.last_name}`.trim() || member.user.username}
                  </h3>
                  <p className="member-email">{member.user.email}</p>
                  <div className="member-meta">
                    <span className={`role-badge ${member.role}`}>
                      {getRoleIcon(member.role)} {member.role}
                    </span>
                    <span className={`status-badge ${member.status}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="member-contact">
                <div className="contact-item">
                  <FiMail className="contact-icon" />
                  <span>{member.user.email}</span>
                </div>
                {member.user.phone && (
                  <div className="contact-item">
                    <FiPhone className="contact-icon" />
                    <span>{member.user.phone}</span>
                  </div>
                )}
              </div>

              {/* Member Details */}
              <div className="member-details">
                <div className="member-detail-item">
                  <span className="detail-label">Joined:</span>
                  <span className="detail-value">
                    {new Date(member.date_joined).toLocaleDateString()}
                  </span>
                </div>
                {member.user.designation && (
                  <div className="member-detail-item">
                    <span className="detail-label">Designation:</span>
                    <span className="detail-value">{member.user.designation}</span>
                    
                  </div>
                )}
                {member.user.bio && (
                  <div className="member-detail-item">
                    <span className="detail-label">Designation:</span>
                    <span className="detail-value">{member.user.bio}</span>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {userRole && canManageMember(member) && (
                <div className="admin-actions">
                  {member.status === 'pending' && (
                    <>
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => handleMembershipAction(member.id, 'approve')}
                        disabled={actionLoading === member.id}
                      >
                        <FiUserCheck /> 
                        {actionLoading === member.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => handleMembershipAction(member.id, 'reject')}
                        disabled={actionLoading === member.id}
                      >
                        <FiUserX />
                        {actionLoading === member.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </>
                  )}
                  
                  {member.status === 'approved' && (
                    <>
                      {member.role !== 'president' && (
                        <button 
                          className="action-btn promote-btn"
                          onClick={() => handleMembershipAction(member.id, 'promote')}
                          disabled={actionLoading === member.id}
                        >
                          <FiArrowUp />
                          {actionLoading === member.id ? 'Promoting...' : 'Promote'}
                        </button>
                      )}
                      
                      {(member.role === 'admin' || member.role === 'secretary') && member.role !== 'president' && (
                        <button 
                          className="action-btn demote-btn"
                          onClick={() => handleMembershipAction(member.id, 'demote')}
                          disabled={actionLoading === member.id}
                        >
                          <FiArrowDown />
                          {actionLoading === member.id ? 'Demoting...' : 'Demote'}
                        </button>
                      )}
                      
                      <button 
                        className="action-btn remove-btn"
                        onClick={() => handleMembershipAction(member.id, 'remove')}
                        disabled={actionLoading === member.id}
                      >
                        <FiUserX />
                        {actionLoading === member.id ? 'Removing...' : 'Remove'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Role Hierarchy Info for Admins */}
              {userRole && ['admin', 'president'].includes(userRole) && member.role === 'president' && (
                <div className="role-hierarchy">
                  <p>⚠️ Only the president can manage other presidents</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Leave Club Modal */}
      {showLeaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Leave Club</h3>
            <p>Are you sure you want to leave this club? This action cannot be undone.</p>
            <textarea
              placeholder="Reason for leaving (optional)"
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              className="reason-textarea"
            />
            <div className="modal-actions">
              <button 
                onClick={() => setShowLeaveModal(false)}
                className="cancel-btn"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button 
                onClick={confirmLeave}
                className="confirm-btn"
                disabled={actionLoading}
              >
                {actionLoading === 'leave' ? 'Leaving...' : 'Confirm Leave'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;