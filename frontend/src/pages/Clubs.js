import { useState, useEffect } from "react";
import { useClubs } from "../context/ClubContext";
import ClubCard from "../components/Card/ClubCard";
import ClubForm from "../forms/ClubForm";
import authService from "../services/authService";
import PermissionModal from "../components/PermissionModal";
import "./Clubs.css";

const Clubs = () => {
  const { clubs, editClub, removeClub, loading } = useClubs();
  const [showClubForm, setShowClubForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInterest, setFilterInterest] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [permissionModal, setPermissionModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Get unique interests for filter dropdown
  const interests = ["all", ...new Set(clubs
    .map(club => club.interest)
    .filter(interest => interest !== null && interest !== undefined)
  )];

  // Filter clubs based on search term and interest
  const filteredClubs = clubs.filter(club => {
    const clubName = club.name || "";
    const clubDescription = club.description || "";
    const clubInterest = club.interest || "";
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      clubName.toLowerCase().includes(searchTermLower) ||
      clubDescription.toLowerCase().includes(searchTermLower);

    const matchesInterest = filterInterest === "all" || clubInterest === filterInterest;

    return matchesSearch && matchesInterest;
  });

  const handleCreateClick = () => {
    if (currentUser?.is_staff || currentUser?.is_superuser) {
      setShowClubForm(!showClubForm);
    } else {
      setPermissionModal({
        isOpen: true,
        message: "Only System Administrators have permission to create new clubs. Please contact the administration."
      });
    }
  };

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

  if (loading) {
    return (
      <div className="club-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading clubs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="club-page">
      <div className="club-headerr">
        <h1 className="club-heading">College Clubs</h1>
        <p className="club-subheading">Clubs bring students together to share interests, learn, and collaborate.
          They create space for growth, creativity, and teamwork while making college life engaging and memorable..</p>
      </div>

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
          onClick={handleCreateClick}
        >
          {showClubForm ? "Cancel" : "Create New Club"}
          <i className={`fas ${showClubForm ? "fa-times" : "fa-plus"}`}></i>
        </button>
      </div>

      {showClubForm && (
        <div className="form-container">
          <ClubForm
            onSuccess={() => setShowClubForm(false)}
            onCancel={() => setShowClubForm(false)}
          />
        </div>
      )}

      {/* Permission Modal */}
      <PermissionModal
        isOpen={permissionModal.isOpen}
        onClose={() => setPermissionModal({ ...permissionModal, isOpen: false })}
        message={permissionModal.message}
      />

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