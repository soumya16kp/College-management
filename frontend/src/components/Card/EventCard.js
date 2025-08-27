
import './EventCard.css';
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, type }) => {
  const navigate= useNavigate();
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
    switch(type) {
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

  const handleRegister=()=>{
      navigate(`/events/${event.id}`);
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`);
    alert("Event link copied to clipboard!");
  };

  return (
    <div className="event-card">
      <div className="event-image">
        <img 
          src={event.imageUrl || '/api/placeholder/300/200'} 
          alt={event.title}
        />
        {getStatusBadge()}
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="event-detail">
            <span className="detail-icon">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          
          {event.location && (
            <div className="event-detail">
              <span className="detail-icon">📍</span>
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        <div className="event-actions">
          <button className="event-btn primary" onClick={handleRegister}>
            {type === "past" ? "View Details" : "Register Now"}
          </button>
          <button className="event-btn secondary" onclick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;