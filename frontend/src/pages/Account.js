import { useState } from "react";
import { useUser } from "../context/UserContext";
import AccountForm from "../forms/AccountForm";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { logout } from "../store/AuthSlice";
import "./Account.css";

import { 
  FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar,
  FiLogOut, FiEdit2, FiChevronRight, FiCheckCircle,
  FiClock, FiUsers, FiMapPin, FiGlobe
} from "react-icons/fi";
import { TbBuildingCommunity } from "react-icons/tb";

const AccountPage = () => {
  const { profile, loading } = useUser();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }
  console.log(profile)
  if (!profile) {
    return (
      <div className="account-container">
        <div className="error-state">
          <FiUser size={48} className="error-icon" />
          <h3>No Profile Found</h3>
          <p>Unable to load your profile. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      registered: { label: "Registered", className: "status-registered" },
      attended: { label: "Attended", className: "status-attended" },
      cancelled: { label: "Cancelled", className: "status-cancelled" },
      pending: { label: "Pending", className: "status-pending" },
    };
    return configs[status] || configs.pending;
  };

  const stats = {
    totalEvents: profile.participated_events?.length || 0,
    registeredEvents: profile.participated_events?.filter(e => e.status === "registered").length || 0,
    attendedEvents: profile.participated_events?.filter(e => e.status === "attended").length || 0,
  };

  return (
    <div className="account-page">
      {/* Header */}
      <header className="account-header">
        <div className="header-content">
          <div className="header-title">
            <h1>My Account</h1>
            <p className="header-subtitle">Manage your profile and activity</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className="account-layout">
        {/* Sidebar Profile Card */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-wrapper">
                {profile.profile_image ? (
                  <img
                    src={`http://127.0.0.1:8000${profile.profile_image}`}
                    alt={`${profile.user?.first_name} ${profile.user?.last_name}`}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser size={40} />
                  </div>
                )}
                <button 
                  className="edit-avatar-button"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit profile"
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
              
              <div className="profile-info">
                <h2 className="profile-name">
                  {profile.user?.first_name} {profile.user?.last_name}
                </h2>
                <p className="profile-role">{profile.designation || "Member"}</p>
                <p className="profile-handle">@{profile.user?.username}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-value">{stats.totalEvents}</div>
                <div className="stat-label">Total Events</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.registeredEvents}</div>
                <div className="stat-label">Registered</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.attendedEvents}</div>
                <div className="stat-label">Attended</div>
              </div>
            </div>

            <div className="profile-actions">
              <button 
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="contact-card">
            <h3 className="card-title">Contact Information</h3>
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div className="contact-details">
                  <div className="contact-label">Email</div>
                  <div className="contact-value">{profile.user?.email}</div>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <FiPhone />
                </div>
                <div className="contact-details">
                  <div className="contact-label">Phone</div>
                  <div className="contact-value">{profile.phone || "Not provided"}</div>
                </div>
              </div>
              
              {profile.location && (
                <div className="contact-item">
                  <div className="contact-icon">
                    <FiMapPin />
                  </div>
                  <div className="contact-details">
                    <div className="contact-label">Location</div>
                    <div className="contact-value">{profile.location}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="account-main">
          {/* Tabs Navigation */}
          <div className="content-tabs">
            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FiUser size={18} />
              Profile Details
            </button>
            <button
              className={`tab-button ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              <FiCalendar size={18} />
              Event History
              <span className="tab-badge">{stats.totalEvents}</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "profile" && !isEditing && (
              <div className="profile-details-section">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  <button 
                    className="edit-section-button"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                </div>
                
                <div className="details-grid">
                  <div className="detail-card">
                    <div className="detail-header">
                      <FiBriefcase className="detail-icon" />
                      <h3>Professional</h3>
                    </div>
                    <div className="detail-content">
                      <div className="detail-item">
                        <label>Designation</label>
                        <p>{profile.designation || "Not specified"}</p>
                      </div>
                      <div className="detail-item">
                        <label>Company/Organization</label>
                        <p>{profile.company || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="detail-card">
                    <div className="detail-header">
                      <FiUser className="detail-icon" />
                      <h3>Personal</h3>
                    </div>
                    <div className="detail-content">
                      <div className="detail-item">
                        <label>Bio</label>
                        <p className="bio-text">{profile.bio || "No bio provided"}</p>
                      </div>
                      <div className="detail-item">
                        <label>Member Since</label>
                        <p>{formatDate(profile.user?.date_joined)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "events" && (
              <div className="events-section">
                <div className="section-header">
                  <h2>Event Participation</h2>
                  <span className="events-count">
                    {stats.totalEvents} total events
                  </span>
                </div>

                {profile.participated_events && profile.participated_events.length > 0 ? (
                  <div className="events-list">
                    {profile.participated_events.map((eventItem) => {
                      const status = getStatusConfig(eventItem.status);
                      return (
                        <div key={eventItem.id} className="event-card">
                          <div className="event-header">
                            <div className="event-title-group">
                              <h3>{eventItem.event?.title}</h3>
                              <div className={`status-badge ${status.className}`}>
                                {status.label}
                              </div>
                            </div>
                            <div className="event-club">
                              <TbBuildingCommunity size={16} />
                              <span>{eventItem.event?.club?.name}</span>
                            </div>
                          </div>

                          <div className="event-details">
                            <div className="event-info">
                              <FiCalendar size={16} />
                              <span>{formatDate(eventItem.event?.date)}</span>
                            </div>
                            <div className="event-info">
                              <FiClock size={16} />
                              <span>{eventItem.event?.time || "Time TBD"}</span>
                            </div>
                          </div>

                          <div className="event-footer">
                            <div className="registration-info">
                              <FiCheckCircle size={16} />
                              <span>Registered on {formatDate(eventItem.registered_at)}</span>
                            </div>
                            <button className="event-action-button">
                              View Details
                              <FiChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FiCalendar size={64} className="empty-icon" />
                    <h3>No Events Yet</h3>
                    <p>You haven't registered for any events. Start exploring!</p>
                  </div>
                )}
              </div>
            )}

            {/* Edit Form Overlay */}
            {isEditing && (
              <div className="edit-overlay">
                <div className="edit-modal">
                  <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button 
                      className="modal-close"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="modal-content">
                    <AccountForm 
                      onSuccess={() => {
                        setIsEditing(false);
                        // Optionally refresh profile data here
                      }}
                      onCancel={() => setIsEditing(false)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;