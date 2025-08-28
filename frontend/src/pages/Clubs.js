import { useState } from "react";
import { useClubs } from "../context/ClubContext";
import ClubCard from "../components/Card/ClubCard";
import ClubForm from "../forms/ClubForm";
import "./Clubs.css";

const Clubs = () => {
  const { clubs, addClub, editClub, removeClub } = useClubs();
  const [showClubForm, setShowClubForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInterest, setFilterInterest] = useState("all");

  // Get unique interests for filter dropdown
  const interests = ["all", ...new Set(clubs
    .map(club => club.interest)
    .filter(interest => interest !== null && interest !== undefined)
  )];

  // Filter clubs based on search term and interest - FIXED NULL VALUES
  const filteredClubs = clubs.filter(club => {
    // Safely handle potential null/undefined values with fallbacks
    const clubName = club.name || "";
    const clubDescription = club.description || "";
    const clubInterest = club.interest || "";
    
    // Convert to lowercase only after ensuring it's a string
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      clubName.toLowerCase().includes(searchTermLower) || 
      clubDescription.toLowerCase().includes(searchTermLower);
    
    const matchesInterest = filterInterest === "all" || clubInterest === filterInterest;
    
    return matchesSearch && matchesInterest;
  });

  const handleEdit = (club) => {
    const updatedName = prompt("Enter new name:", club.name || "");
    if (updatedName === null) return; 
    
    const updatedDesc = prompt("Enter new description:", club.description || "");
    if (updatedName !== null && updatedDesc !== null) {
      editClub(club.id, { 
        name: updatedName, 
        description: updatedDesc,
        interest: club.interest || ""
      });
    }
  };

  return (
    <div className="club-page">
      <header className="club-header">
        <h1 className="club-heading">College Clubs</h1>
        <p className="club-subheading">Clubs bring students together to share interests, learn, and collaborate.
           They create space for growth, creativity, and teamwork while making college life engaging and memorable..</p>
      </header>

      <div className="club-controls">
        <div className="search-filter-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-dropdown">
            <select 
              value={filterInterest} 
              onChange={(e) => setFilterInterest(e.target.value)}
              className="interest-filter"
            >
              {interests.map(interest => (
                <option key={interest} value={interest}>
                  {interest === "all" ? "All Interests" : interest}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button 
          className="btn create-club-btn"
          onClick={() => setShowClubForm(!showClubForm)}
        >
          {showClubForm ? "Cancel" : "Create New Club"}
          <i className={`fas ${showClubForm ? "fa-times" : "fa-plus"}`}></i>
        </button>
      </div>

      {showClubForm && (
        <div className="form-container">
          <ClubForm onSuccess={() => setShowClubForm(false)} />
        </div>
      )}

      {filteredClubs.length === 0 ? (
        <div className="no-clubs-message">
          <i className="fas fa-users"></i>
          <h3>No clubs found</h3>
          <p>Try adjusting your search or create a new club</p>
        </div>
      ) : (
        <>
          <div className="club-stats">
            <span className="stat">
              <strong>{clubs.length}</strong> clubs total
            </span>
            {filterInterest !== "all" && (
              <span className="stat">
                <strong>{filteredClubs.length}</strong> clubs in {filterInterest}
              </span>
            )}
          </div>

          <div className="club-grid">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onEdit={handleEdit}
                onDelete={removeClub}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Clubs;