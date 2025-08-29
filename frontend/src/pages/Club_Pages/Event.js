import { useEffect, useState } from "react";
import EventForm from "../../forms/EventForm";
import { useEvents } from "../../context/EventContext";
import { useParams } from "react-router-dom";
import { FiCalendar, FiClock, FiMapPin, FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { MdEvent, MdGroups } from "react-icons/md";
import "./Event.css";

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

  if (loading) return <div className="events-loading">Loading events...</div>;
  if (error) return <div className="events-error">Error: {error}</div>;

  return (
    <div className="club-events-container">
      {/* Header */}
      <div className="events-header">
        <div className="header-content">
          <MdEvent className="header-icon" />
          <div>
            <h1>Club Events</h1>
            <p>Manage and organize your club's events</p>
          </div>
        </div>
        <button 
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus className="btn-icon" />
          {showForm ? "Cancel" : "Add New Event"}
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="form-section">
          <EventForm clubId={id} onAddEvent={handleAddEvent} />
        </div>
      )}

      {/* Events Content */}
      <div className="events-content">
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-container">
              <MdEvent className="empty-icon" />
            </div>
            <h3>No Events Scheduled</h3>
            <p>Get started by creating your first event for the club!</p>
            {!showForm && (
              <button 
                className="cta-button"
                onClick={() => setShowForm(true)}
              >
                <FiPlus className="btn-icon" />
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                {/* Event Header */}
                <div className="event-header">
                  <div className="event-title-section">
                    <h3 className="event-title">{event.title}</h3>
                    <span className="event-date-badge">
                      {formatDate(event.date)}
                    </span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleRemoveEvent(event.id)}
                    title="Delete event"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                
                {/* Event Description */}
                <p className="event-description">{event.description}</p>
                
                {/* Event Details */}
                <div className="event-details-grid">
                  <div className="detail-item">
                    <FiCalendar className="detail-icon" />
                    <div>
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{formatDate(event.date)}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FiClock className="detail-icon" />
                    <div>
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{formatTime(event.time)}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <FiMapPin className="detail-icon" />
                    <div>
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{event.location || "To be announced"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Organized By */}
                {event.club && (
                  <div className="organizer-section">
                    <MdGroups className="organizer-icon" />
                    <span className="organizer-text">
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