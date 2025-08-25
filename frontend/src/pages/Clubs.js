import {clubs} from "../components/Home_Components/ClubSlideShow";
import { useState } from "react";
import { useClubs } from "../context/ClubContext";
import ClubCard from "../components/Club_Card/ClubCard";
import "./Clubs.css";
import ClubsList from "../components/Home_Components/ClubSlideShow";
const Clubs = () => {
  const { clubs, addClub, editClub, removeClub } = useClubs();
  const [newClub, setNewClub] = useState({ name: "", description: "" });

  const handleAddClub = (e) => {
    e.preventDefault();
    if (!newClub.name.trim()) return;
    addClub(newClub);
    setNewClub({ name: "", description: "" });
  };

  const handleEdit = (club) => {
    const updatedName = prompt("Enter new name:", club.name);
    const updatedDesc = prompt("Enter new description:", club.description);
    if (updatedName && updatedDesc) {
      editClub(club.id, { name: updatedName, description: updatedDesc });
    }
  };

  return (
    <div className="club-page">
      <ClubsList classes={0} />
      <h1 className="club-heading">College Clubs</h1>

      <form onSubmit={handleAddClub} className="club-form">
        <input
          type="text"
          placeholder="Club Name"
          value={newClub.name}
          onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
          className="club-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={newClub.description}
          onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
          className="club-input"
        />
        <button type="submit" className="btn add-btn">➕ Add Club</button>
      </form>

      <div className="club-grid">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
            onEdit={handleEdit}
            onDelete={removeClub}
          />
        ))}
      </div>
    </div>
  );
};

export default Clubs