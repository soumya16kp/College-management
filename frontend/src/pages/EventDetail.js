import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiShare2,
  FiBookmark,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { TbBuildingCommunity } from "react-icons/tb";
import EventEditForm from "../forms/EventEditForm";
import "./EventDetail.css";
import { getMediaUrl } from '../services/media';
import authService from "../services/authService";
import EventTimeline from "../components/Event/EventTimeline";
import EventPrizes from "../components/Event/EventPrizes";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEvent, fetchEventDetail, removeEvent, loading, error } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch event details
  useEffect(() => {
    fetchEventDetail(id);
  }, [id, fetchEventDetail]);

  // Sync local state with selectedEvent when it loads
  useEffect(() => {
    if (selectedEvent) {
      setParticipantsCount(selectedEvent.total_participants || 0);
      setIsRegistered(!!selectedEvent.user_registered);
    }
  }, [selectedEvent]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 4000);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await removeEvent(id);
        navigate(-1);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const registerForEvent = async (eventId) => {
    try {
      const res = await authService.apiClient.post(`/events/${eventId}/register/`);
      showNotification("Registration successful! You're in.", "success");

      if (!isRegistered) {
        setIsRegistered(true);
        setParticipantsCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(err.response?.data);
      showNotification(err.response?.data?.detail || "Failed to register. Please try again.", "error");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedEvent) => {
    console.log("Event updated successfully:", updatedEvent);
    setIsEditing(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Event link copied to clipboard!", "success");
  };

  const handleSaveEvent = () => {
    setIsSaved(!isSaved);
    showNotification(isSaved ? "Event removed from saved." : "Event saved to your list!", "success");
  };

  if (loading) return (
    <div className="cause">
      <div className="event-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="cause">
      <div className="event-detail-error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  if (!selectedEvent) return null;

  // Format date and time
  const formattedDate = new Date(selectedEvent.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = selectedEvent.time
    ? new Date(`2000-01-01T${selectedEvent.time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    : "TBA";

  return (
    <div className="cause">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Edit Form Modal */}
      {isEditing && (
        <EventEditForm
          event={selectedEvent}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="event-detail-container">
        {/* Back Navigation */}
        <div className="event-detail-nav">
          <button className="event-detail-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            <span>Back to Events</span>
          </button>

          <div className="event-detail-actions">
            <button
              className={`event-action-btn save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSaveEvent}
              aria-label={isSaved ? "Remove from saved" : "Save event"}
            >
              <FiBookmark />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>

            <button
              className="event-action-btn share-btn"
              onClick={handleShare}
              aria-label="Share event"
            >
              <FiShare2 />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Event Header Card */}
        <div className="event-detail-header-card">
          <div className="header-image-section">
            {selectedEvent.image ? (
              <img
                src={getMediaUrl(selectedEvent.image)}
                alt={selectedEvent.title}
                className="event-header-image"
              />
            ) : (
              <div className="event-header-placeholder">
                <TbBuildingCommunity />
              </div>
            )}
            <div className="header-overlay">
              <span className="event-category-badge">{selectedEvent.club?.name || "Event"}</span>
            </div>
          </div>

          <div className="header-content-section">
            <div className="header-title-row">
              <h1 className="event-main-title">{selectedEvent.title}</h1>
              <div className="event-detail-menu">
                <button
                  className="event-menu-trigger"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Event options"
                >
                  <FiMoreVertical />
                </button>

                {isMenuOpen && (
                  <div className="event-menu-dropdown">
                    <button onClick={handleEdit} className="menu-dropdown-item">
                      <FiEdit />
                      <span>Edit Event</span>
                    </button>
                    <button onClick={handleDelete} className="menu-dropdown-item delete">
                      <FiTrash2 />
                      <span>Delete Event</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <p className="event-organizer">
              Organized by <span className="organizer-name">{selectedEvent.club?.name}</span>
            </p>

            <div className="header-meta-grid">
              <div className="meta-item">
                <FiCalendar className="meta-icon" />
                <div>
                  <span className="meta-label">Date</span>
                  <span className="meta-value">{formattedDate}</span>
                </div>
              </div>
              <div className="meta-item">
                <FiClock className="meta-icon" />
                <div>
                  <span className="meta-label">Time</span>
                  <span className="meta-value">{formattedTime}</span>
                </div>
              </div>
              <div className="meta-item">
                <FiMapPin className="meta-icon" />
                <div>
                  <span className="meta-label">Location</span>
                  <span className="meta-value">{selectedEvent.location || "TBA"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="event-detail-layout">
          {/* Main Content Column */}
          <div className="event-main-column">
            <div className="content-section">
              <h2 className="section-heading">About This Event</h2>
              <div className="description-text">
                {selectedEvent.description ? (
                  selectedEvent.description.split('\n').map((para, index) => (
                    <p key={index}>{para}</p>
                  ))
                ) : (
                  <p className="no-description">No description provided for this event.</p>
                )}
              </div>
            </div>

            {/* Timeline Section */}
            {selectedEvent.timeline && selectedEvent.timeline.length > 0 && (
              <div className="content-section">
                <h2 className="section-heading">Stages and Timelines</h2>
                <EventTimeline timelineData={selectedEvent.timeline} />
              </div>
            )}

            {/* Prizes Section */}
            {selectedEvent.prizes && selectedEvent.prizes.length > 0 && (
              <div className="content-section">
                <h2 className="section-heading">Rewards and Prizes</h2>
                <EventPrizes prizesData={selectedEvent.prizes} />
              </div>
            )}

            <div className="content-section">
              <h2 className="section-heading">Additional Information</h2>
              <ul className="info-list">
                <li><strong>Dress Code:</strong> Smart Casual</li>
                <li><strong>Eligibility:</strong> {selectedEvent.club?.is_private ? "Members Only" : "Open to All Students"}</li>
                <li><strong>Contact:</strong> events@{selectedEvent.club?.name?.toLowerCase().replace(/\s+/g, '')}.edu</li>
              </ul>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="event-sidebar-column">
            <div className="registration-card">
              <div className="registration-header">
                <h3>Registration</h3>
                {isRegistered && <span className="registered-badge"><FiCheckCircle /> Registered</span>}
              </div>

              <div className="participants-info">
                <div className="participants-count">
                  <FiUsers />
                  <span>{participantsCount}</span>
                </div>
                <span className="participants-label">people attending</span>
              </div>

              <button
                className={`registration-btn ${isRegistered ? 'registered' : ''} ${new Date(selectedEvent.date) < new Date().setHours(0, 0, 0, 0) ? 'completed' : ''}`}
                onClick={() => !isRegistered && !(new Date(selectedEvent.date) < new Date().setHours(0, 0, 0, 0)) && registerForEvent(selectedEvent.id)}
                disabled={isRegistered || (new Date(selectedEvent.date) < new Date().setHours(0, 0, 0, 0))}
              >
                {new Date(selectedEvent.date) < new Date().setHours(0, 0, 0, 0) ? "Event Completed" : isRegistered ? "You are Registered" : "Register Now"}
              </button>

              <p className="registration-note">
                {new Date(selectedEvent.date) < new Date().setHours(0, 0, 0, 0)
                  ? "This event has already taken place."
                  : isRegistered
                    ? "You are all set! We look forward to seeing you there."
                    : "Secure your spot now directly through the portal."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
