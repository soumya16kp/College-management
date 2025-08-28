import { useState, useEffect } from 'react';
import './ClubAbout.css';
import { useClubs } from "../../context/ClubContext";
import { useParams } from 'react-router-dom';
import ClubEditForm from '../../forms/ClubEditForm'; // Import the new component

const ClubAbout = () => {
  const { id } = useParams();
  const { clubs, editClub, removeClub } = useClubs();
  const [club, setClub] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const found = clubs.find((c) => String(c.id) === String(id));
    if (found) {
      setClub(found);
    }
  }, [id, clubs]);

  if (!club) {
    return <p>Loading club...</p>;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    closeMenu();
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    closeMenu();
  };

  const handleSaveEdit = async (formData) => {
    try {
      // Create FormData for file uploads
      const uploadData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          uploadData.append(key, formData[key]);
        }
      });
      
      await editClub(club.id, uploadData);
      setIsEditModalOpen(false);
      
      // Refresh the club data
      const updatedClub = clubs.find((c) => String(c.id) === String(id));
      if (updatedClub) {
        setClub(updatedClub);
      }
    } catch (error) {
      console.error("Failed to update club:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await removeClub(club.id);
      setIsDeleteModalOpen(false);
      // Navigate away or show success message
    } catch (error) {
      console.error("Failed to delete club:", error);
    }
  };

  return (
    <div className="club-about-container" onClick={closeMenu}>
      <div className="club-header">
        <img 
          src={club.coursol || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"} 
          alt="Club Banner" 
          className="club-banner" 
        />
      </div>

      <div className="club-info">
        {/* Actions Dropdown */}
        <div className="club-actions">
          <button className="menu-toggle" onClick={(e) => {
            e.stopPropagation();
            toggleMenu();
          }}>
            <i className="fas fa-ellipsis-v"></i>
          </button>
          <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
            <div className="dropdown-item edit-item" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit Club
            </div>
            <div className="dropdown-item delete-item" onClick={handleDelete}>
              <i className="fas fa-trash-alt"></i> Delete Club
            </div>
          </div>
        </div>

        {/* Club Title and Logo */}
        <div className="club-title">
          <img 
            src={club.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"} 
            alt="Club Logo" 
            className="club-logo" 
          />
          <div>
            <h1 className="club-name">{club.name}</h1>
            <span className="club-category">{club.tagline}</span>
          </div>
        </div>

        {/* Club Stats */}
        <div className="club-stats">
          <div className="stat">
            <div className="stat-number">248</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat">
            <div className="stat-number">42</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat">
            <div className="stat-number">2018</div>
            <div className="stat-label">Founded</div>
          </div>
          <div className="stat">
            <div className="stat-number">16</div>
            <div className="stat-label">Books/Month</div>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2 className="section-title">About Us</h2>
          <p className="about-text">
            {club.description}
          </p>
        </div>

        {/* Club Details */}
        <div className="club-details">
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-users"></i> Membership
            </div>
            <div className="detail-content">
              {club.interest}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-map-marker-alt"></i> Location
            </div>
            <div className="detail-content">
              {club.location}
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-calendar-alt"></i> Meeting Schedule
            </div>
            <div className="detail-content">
             {club.schedule}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="members-section">
          <h2 className="section-title">Club Leaders</h2>
          <div className="members-grid">
            <div className="member-card">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                alt="Member" 
                className="member-img" 
              />
              <div className="member-info">
                <div className="member-name">Sarah Johnson</div>
                <div className="member-role">Founder & Lead Organizer</div>
              </div>
            </div>
            <div className="member-card">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80" 
                alt="Member" 
                className="member-img" 
              />
              <div className="member-info">
                <div className="member-name">Michael Chen</div>
                <div className="member-role">Discussion Moderator</div>
              </div>
            </div>
            <div className="member-card">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80" 
                alt="Member" 
                className="member-img" 
              />
              <div className="member-info">
                <div className="member-name">Jessica Williams</div>
                <div className="member-role">Event Coordinator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal using ClubEditForm component */}
      {isEditModalOpen && (
        <ClubEditForm 
          club={club} 
          onSave={handleSaveEdit} 
          onCancel={() => setIsEditModalOpen(false)} 
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Delete Club</h2>
              <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                &times;
              </button>
            </div>
            <p>Are you sure you want to delete "{club.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-cancel" 
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={confirmDelete}
              >
                Delete Club
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubAbout;