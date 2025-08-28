import { useState } from 'react';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Edit Club Information</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="club-edit-form">
          <div className="form-group">
            <label className="form-label">Club Name</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input 
              type="text" 
              name="tagline"
              className="form-input" 
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description"
              className="form-input form-textarea" 
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label className="form-label">Interest Category</label>
            <input 
              type="text" 
              name="interest"
              className="form-input" 
              value={formData.interest}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              name="location"
              className="form-input" 
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Meeting Schedule</label>
            <input 
              type="text" 
              name="schedule"
              className="form-input" 
              value={formData.schedule}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Club Logo/Image</label>
            <input 
              type="file"
              name="image"
              className="form-input" 
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Cover Image (Optional)</label>
            <input 
              type="file"
              name="coursol"
              className="form-input" 
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
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