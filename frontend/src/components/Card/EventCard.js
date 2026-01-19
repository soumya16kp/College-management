import { useState } from 'react';
import { getMediaUrl } from '../../services/media';
import './EventCard.css';
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiShare2, FiArrowRight } from "react-icons/fi";

const EventCard = ({ event, type }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadge = () => {
    switch (type) {
      case "live":
        return <span className="status-badge live">Live Now</span>;
      case "upcoming":
        return <span className="status-badge upcoming">Upcoming</span>;
      case "past":
        return <span className="status-badge past">Completed</span>;
      default:
        return null;
    }
  };

  const handleRegister = () => {
    navigate(`/events/${event.id}`);
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
    alert("Event link copied to clipboard!");
  };

  const renderDescription = () => {
    const description = event.description || "";
    const words = description.split(" ");
    const isLong = words.length > 25;

    if (!isLong) {
      return <p className="event-description">{description}</p>;
    }

    return (
      <div className="event-description-container">
        <p className="event-description">
          {isExpanded ? description : words.slice(0, 25).join(" ") + "..."}
          <span
            className="read-more-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? " Show Less" : " Read More"}
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img
          src={getMediaUrl(event.image) || '/api/placeholder/300/200'}
          alt={event.title}
        />
        {getStatusBadge()}
      </div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        {renderDescription()}

        <div className="event-details">
          <div className="event-detail">
            <span className="detail-icon"><FiCalendar /></span>
            <span>{formatDate(event.date)}</span>
          </div>

          {event.location && (
            <div className="event-detail">
              <span className="detail-icon"><FiMapPin /></span>
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="event-actions">
          <button className="event-btn primary" onClick={handleRegister}>
            {type === "past" ? "View Details" : "Register Now"}
            <FiArrowRight style={{ marginLeft: '8px' }} />
          </button>
          <button className="event-btn secondary" onClick={handleShare}>
            <FiShare2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;