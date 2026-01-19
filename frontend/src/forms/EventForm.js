import { useState, useEffect } from "react";
import { FiImage, FiPlus } from "react-icons/fi";
import "./EventForm.css";

const EventForm = ({ clubId, onAddEvent, onCancel }) => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: null, // Store the actual file object here
  });

  const [imagePreview, setImagePreview] = useState(null); // Local state for showing the thumbnail

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Specific handler for file input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventData({ ...eventData, image: file });
      setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventData.title.trim()) return;

    // Send data to parent
    onAddEvent(clubId, eventData);

    // Reset Form
    setEventData({
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Add New Event</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="event-form-close-btn"
            aria-label="Close"
          >
            ✕
          </button>
        )}
      </div>

      {/* --- Image Upload Section --- */}
      <div className="form-group image-upload-group">
        <label className="image-upload-label">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          ) : (
            <div className="upload-placeholder">
              <FiImage className="upload-icon" size={24} />
              <span>Upload Event Cover</span>
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input-hidden"
          />
        </label>
      </div>

      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={eventData.title}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={eventData.location}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Event Description"
        value={eventData.description}
        onChange={handleChange}
        rows="4"
      />

      <button type="submit" className="btn">
        <FiPlus style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> Add Event
      </button>
    </form>
  );
};

export default EventForm;