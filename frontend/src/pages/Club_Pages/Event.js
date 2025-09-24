import { useEffect, useState } from "react";
import EventForm from "../../forms/EventForm";
import { useEvents } from "../../context/EventContext";
import { useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { MdEvent, MdGroups } from "react-icons/md";
import "./ClubEvent.css";

function ClubEvent() {
  const { id } = useParams(); 
  const { events, fetchEvents, addEvent, removeEvent, loading, error } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (id) {
      fetchEvents(id);
    }
  }, [id, fetchEvents]);

  const handleAddEvent = async (clubId, eventData) => {
    try {
      await addEvent(clubId, eventData);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleRemoveEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await removeEvent(eventId);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBA";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) return <div className="club-event-loading">Loading events...</div>;
  if (error) return <div className="club-event-error">Error: {error}</div>;

  return (
    <div className="club-event-container">
      {/* Header */}
      <div className="club-event-header">
        <div className="club-event-header-content">
          <MdEvent className="club-event-header-icon" />
          <div>
            <h1>Club Events</h1>
            <p>Manage and organize your club's events</p>
          </div>
        </div>
        <button 
          className="club-event-toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus className="club-event-btn-icon" />
          {showForm ? "Cancel" : "Add New Event"}
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="club-event-form-section">
          <EventForm clubId={id} onAddEvent={handleAddEvent} />
        </div>
      )}

      {/* Events Content */}
      <div className="club-event-content">
        {events.length === 0 ? (
          <div className="club-event-empty-state">
            <div className="club-event-empty-icon-container">
              <MdEvent className="club-event-empty-icon" />
            </div>
            <h3>No Events Scheduled</h3>
            <p>Get started by creating your first event for the club!</p>
            {!showForm && (
              <button 
                className="club-event-cta-button"
                onClick={() => setShowForm(true)}
              >
                <FiPlus className="club-event-btn-icon" />
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <div className="club-event-grid">
            {events.map((event) => (
              <div key={event.id} className="club-event-card">
                {/* Event Header */}
                <div className="club-event-card-header">
                  <div className="club-event-title-section">
                    <h3 className="club-event-title">{event.title}</h3>
                    <span className="club-event-date-badge">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <button 
                    className="club-event-delete-btn"
                    onClick={() => handleRemoveEvent(event.id)}
                    title="Delete event"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                {/* Event Description */}
                <p className="club-event-description">{event.description}</p>
                
                {/* Event Details */}
                <div className="club-event-details-grid">
                  <div className="club-event-detail-item">
                    <FiCalendar className="club-event-detail-icon" />
                    <div>
                      <span className="club-event-detail-label">Date</span>
                      <span className="club-event-detail-value">{formatDate(event.date)}</span>
                    </div>
                  </div>
                  
                  <div className="club-event-detail-item">
                    <FiClock className="club-event-detail-icon" />
                    <div>
                      <span className="club-event-detail-label">Time</span>
                      <span className="club-event-detail-value">{formatTime(event.time)}</span>
                    </div>
                  </div>
                  
                  <div className="club-event-detail-item">
                    <FiMapPin className="club-event-detail-icon" />
                    <div>
                      <span className="club-event-detail-label">Location</span>
                      <span className="club-event-detail-value">{event.location || "To be announced"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Organized By */}
                {event.club && (
                  <div className="club-event-organizer-section">
                    <MdGroups className="club-event-organizer-icon" />
                    <span className="club-event-organizer-text">
                      Organized by <strong>{event.club.name}</strong>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubEvent;