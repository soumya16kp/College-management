import { useState } from 'react';
import "./ClubEditForm.css"
const ClubEditForm = ({ club, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: club.name || '',
    tagline: club.tagline || '',
    description: club.description || '',
    interest: club.interest || '',
    location: club.location || '',
    schedule: club.schedule || '',
    image: null,
    coursol: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="club-edit-modal-overlay">
      <div className="club-edit-modal-content">
        <div className="club-edit-modal-header">
          <h2 className="club-edit-modal-title">Edit Club Information</h2>
          <button className="club-edit-close-btn" onClick={onCancel}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="club-edit-form">
          <div className="club-edit-form-content">
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Club Name</label>
              <input 
                type="text" 
                name="name"
                className="club-edit-form-input" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Tagline</label>
              <input 
                type="text" 
                name="tagline"
                className="club-edit-form-input" 
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Interest Category</label>
              <input 
                type="text" 
                name="interest"
                className="club-edit-form-input" 
                value={formData.interest}
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Location</label>
              <input 
                type="text" 
                name="location"
                className="club-edit-form-input" 
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Meeting Schedule</label>
              <input 
                type="text" 
                name="schedule"
                className="club-edit-form-input" 
                value={formData.schedule}
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Club Logo/Image</label>
              <input 
                type="file"
                name="image"
                className="club-edit-form-input" 
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group">
              <label className="club-edit-form-label">Cover Image (Optional)</label>
              <input 
                type="file"
                name="coursol"
                className="club-edit-form-input" 
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            
            <div className="club-edit-form-group club-edit-form-group-fullwidth">
              <label className="club-edit-form-label">Description</label>
              <textarea 
                name="description"
                className="club-edit-form-input club-edit-form-textarea" 
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>
          </div>
          
          <div className="club-edit-modal-actions">
            <button 
              type="button" 
              className="club-edit-btn club-edit-btn-cancel" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="club-edit-btn club-edit-btn-primary" 
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubEditForm;