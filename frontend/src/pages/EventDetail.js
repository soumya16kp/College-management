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
  FiBookmark
} from "react-icons/fi";
import { TbBuildingCommunity } from "react-icons/tb";
import EventEditForm from "../forms/EventEditForm";
import "./EventDetail.css";
import { getMediaUrl } from '../services/media';
import authService from "../services/authService";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEvent, fetchEventDetail, removeEvent, loading, error } = useEvents();
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  useEffect(() => {
    fetchEventDetail(id).then((event) => {
      setParticipantsCount(event?.total_participants || 0);
      if (event?.user_registered) setIsRegistered(true);
    });
  }, [id, fetchEventDetail]);

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
      alert(res.data.detail);

      if (!isRegistered) {
        setIsRegistered(true);
        setParticipantsCount(prev => prev + 1);
      }
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.detail || "Failed to register");
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
    alert("Event link copied to clipboard!");
  };

  const handleSaveEvent = () => {
    setIsSaved(!isSaved);
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

        {/* Event Header */}
        <div className="event-detail-header">
          <div className="event-image-container">
            {selectedEvent.image ? (
              <img 
                src={getMediaUrl(selectedEvent.image)} 
                alt={selectedEvent.title}
                className="event-detail-image"
              />
            ) : (
              <div className="event-image-placeholder">
                <TbBuildingCommunity />
              </div>
            )}
            <div className="event-image-overlay">
              <div className="event-club-badge">
                <TbBuildingCommunity />
                <span>{selectedEvent.club?.name}</span>
              </div>
            </div>
          </div>

          <div className="event-title-section">
            <h1 className="event-detail-title">{selectedEvent.title}</h1>
            <p className="event-detail-subtitle">
              Organized by <strong>{selectedEvent.club?.name}</strong>
            </p>
            
            {/* Action Menu */}
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
        </div>

        <div className="event-detail-content">
          <div className="event-detail-main">
            {/* Event Info Cards */}
            <div className="event-info-cards">
              <div className="info-card">
                <div className="info-card-icon">
                  <FiCalendar />
                </div>
                <div className="info-card-content">
                  <h3>Date</h3>
                  <p>{formattedDate}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <FiClock />
                </div>
                <div className="info-card-content">
                  <h3>Time</h3>
                  <p>{formattedTime}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <FiMapPin />
                </div>
                <div className="info-card-content">
                  <h3>Location</h3>
                  <p>{selectedEvent.location || "To be announced"}</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-card-icon">
                  <FiUsers />
                </div>
                <div className="info-card-content">
                  <h3>Participants</h3>
                  <p>{participantsCount} attending</p>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="event-description-section">
              <h2>About This Event</h2>
              <div className="event-description-content">
                {selectedEvent.description || (
                  <p className="no-description">
                    No description provided for this event.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Action Buttons */}
          <div className="event-detail-sidebar">
            <div className="action-card">
              <h3>Event Status</h3>
              <div className="event-status-badge upcoming">
                Upcoming
              </div>
              
              <button 
                className="primary-action-btn" 
                onClick={() => registerForEvent(selectedEvent.id)}
                disabled={isRegistered}
              >
                {isRegistered ? "Registered" : "Register Now"}
              </button>
              
              <div className="event-meta">
                <p><strong>Category:</strong> Club Event</p>
                <p><strong>Access:</strong> {selectedEvent.club?.is_private ? "Members Only" : "Open to All"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="event-additional-info">
          <h3>Additional Information</h3>
          <ul className="event-info-list">
            <li>
              <strong>Dress Code:</strong> Smart Casual
            </li>
            <li>
              <strong>Registration Required:</strong> Yes
            </li>
            <li>
              <strong>Refreshments:</strong> Will be provided
            </li>
            <li>
              <strong>Contact:</strong> events@{selectedEvent.club?.name?.toLowerCase().replace(/\s+/g, '')}.edu
            </li>
          </ul>
        </div>
        <button className="register-btn">
          Register Now
        </button>
      </div>
    </div>
  );
}
