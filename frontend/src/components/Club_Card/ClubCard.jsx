// frontend/src/components/ClubCard.js

import "./ClubCard.css";

const ClubCard = ({ club, onEdit, onDelete }) => {
  return (
    <div className="club-card">
      <h2 className="club-title">{club.name}</h2>
      <p className="club-description">{club.description}</p>
      <div className="club-actions">
        <button onClick={() => onEdit(club)} className="btn edit-btn">✏️ Edit</button>
        <button onClick={() => onDelete(club.id)} className="btn delete-btn">🗑️ Delete</button>
      </div>
    </div>
  );
};

export default ClubCard;
