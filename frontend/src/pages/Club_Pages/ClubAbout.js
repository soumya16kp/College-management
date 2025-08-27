import React, { useState } from 'react';
import './ClubAbout.css';

const ClubAbout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [aboutText, setAboutText] = useState("Welcome to Literary Legends, a community of passionate readers who believe in the transformative power of books. We gather to explore diverse genres, discuss thought-provoking ideas, and connect with fellow literature enthusiasts. Our club meets every second Tuesday of the month to discuss our latest read, share recommendations, and occasionally host author Q&A sessions.");

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

  const handleSave = () => {
    setIsEditModalOpen(false);
    // In a real app, you would save the changes to your backend here
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    // In a real app, you would delete the club from your backend here
  };

  return (
    <div className="club-about-container" onClick={closeMenu}>
      {/* Club Header with Banner */}
      <div className="club-header">
        <img 
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
          alt="Club Banner" 
          className="club-banner" 
        />
      </div>

      {/* Club Info Section */}
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
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
            alt="Book Club Logo" 
            className="club-logo" 
          />
          <div>
            <h1 className="club-name">Literary Legends Book Club</h1>
            <span className="club-category">Books & Literature</span>
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
            {aboutText}
          </p>
        </div>

        {/* Club Details */}
        <div className="club-details">
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-users"></i> Membership
            </div>
            <div className="detail-content">
              Open to all book lovers. No membership fees required.
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-map-marker-alt"></i> Location
            </div>
            <div className="detail-content">
              Mostly virtual with occasional in-person meetings in Central Park.
            </div>
          </div>
          <div className="detail-card">
            <div className="detail-title">
              <i className="fas fa-calendar-alt"></i> Meeting Schedule
            </div>
            <div className="detail-content">
              Every 2nd Tuesday of the month, 7:00 PM EST via Zoom.
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Edit Club Information</h2>
              <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Club Name</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue="Literary Legends Book Club" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue="Books & Literature" 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-input form-textarea" 
                defaultValue={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Meeting Schedule</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue="Every 2nd Tuesday of the month, 7:00 PM EST" 
              />
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-cancel" 
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
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
            <p>Are you sure you want to delete "Literary Legends Book Club"? This action cannot be undone.</p>
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