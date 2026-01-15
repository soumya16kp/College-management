import { useNavigate } from "react-router-dom";
import "./ClubCard.css";
import { getMediaUrl } from "../../services/media"; // adjust path if needed

const ClubCard = ({ club, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="club-card"
      onClick={() => navigate(`/clubs/${club.id}`)} 
    >
      <div className="club-image-wrapper">
        <img 
          src={getMediaUrl(club.image) || "https://via.placeholder.com/400x250"}
          alt={club.name} 
          className="club-image" 
        />

        <div className="club-overlay">
          <div className="club-content">
            <h3>{club.name}</h3>
            <p>{club.tagline}</p>
            <button 
              className="club-join-btn" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/clubs/${club.id}`);
              }}
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="club-badge">{club.name}</div>
      </div>
    </div>
  );
};

export default ClubCard;
