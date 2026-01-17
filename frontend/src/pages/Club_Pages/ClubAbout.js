import { useState, useEffect } from 'react';
import './ClubAbout.css';
import { useClubs } from "../../context/ClubContext";
import { useParams } from 'react-router-dom';
import ClubEditForm from '../../forms/ClubEditForm'; // Import the new component
import { getMediaUrl } from '../../services/media';

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
      const uploadData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          uploadData.append(key, formData[key]);
        }
      });

      await editClub(club.id, uploadData);
      setIsEditModalOpen(false);

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
    } catch (error) {
      console.error("Failed to delete club:", error);
    }
  };

  return (
    <div className="club-about-container" onClick={closeMenu}>
      <div className="club-header">
        <img
          src={getMediaUrl(club.coursol) || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
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
            src={getMediaUrl(club.image) || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"}
            alt="Club Logo"
            className="club-logo"
          /* onClick handler removed */
          />
          <div>
            <h1 className="club-name">{club.name}</h1>
            <span className="club-category">{club.tagline}</span>
          </div>
        </div>
        {/* Lightbox block removed */}

        <div className="club-stats">
          <div className="stat">
            <i className="fas fa-users stat-icon"></i>
            <div className="stat-number">{club.members_count}</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat">
            <i className="fas fa-calendar-check stat-icon"></i>
            <div className="stat-number">{club.events_count}</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat">
            <i className="fas fa-flag stat-icon"></i>
            <div className="stat-number">{new Date(club.founded).getFullYear()}</div>
            <div className="stat-label">Founded</div>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h2 className="section-title">About Us</h2>
          <p className="about-text">
            {club.description}
          </p>
        </div>

        {/* Club Details Grid (Kept the 3-box improvement as it was accepted earlier, but removing extra layout bits if needed) */}
        <div className="club-details-grid">
          <div className="detail-card">
            <div className="detail-header">
              <div className="detail-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="detail-label">Interest</h3>
            </div>
            <p className="detail-value">{club.interest}</p>
          </div>

          <div className="detail-card">
            <div className="detail-header">
              <div className="detail-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="detail-label">Location</h3>
            </div>
            <p className="detail-value">{club.location}</p>
          </div>

          <div className="detail-card">
            <div className="detail-header">
              <div className="detail-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="detail-label">Meeting Schedule</h3>
            </div>
            <p className="detail-value">{club.schedule}</p>
          </div>
        </div>

      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <ClubEditForm
          club={club}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}

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