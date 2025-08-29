import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useEvents } from "../context/EventContext";
import "./EventEditForm.css";

export default function EventEditForm({ 
  event, 
  onSave, 
  onCancel 
}) {
  const { editEvent, loading, error } = useEvents();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    club: event.club?.id || event.club || "" 

  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        club: formData.club || event.club?.id,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Use the context function to edit the event
      const updatedEvent = await editEvent(event.id, formData);
    
      if (onSave) {
        console.log(formData)
        onSave(updatedEvent);
      }
    } catch (error) {
      console.error("Failed to update event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="event-edit-modal-overlay">
      <div className="event-edit-modal-content">
        <div className="event-edit-modal-header">
          <h2>Edit Event</h2>
          <button 
            type="button" 
            className="event-edit-close-btn" 
            onClick={onCancel}
            disabled={isLoading}
          >
            <FiX />
          </button>
        </div>

        {error && (
          <div className="event-edit-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="event-edit-form">
          <div className="event-edit-form-group">
            <label className="event-edit-form-label">Event Title</label>
            <input
              type="text"
              name="title"
              className="event-edit-form-input"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="event-edit-form-group">
            <label className="event-edit-form-label">Description</label>
            <textarea
              name="description"
              className="event-edit-form-input event-edit-form-textarea"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              disabled={isLoading}
            />
          </div>

          <div className="event-edit-form-row">
            <div className="event-edit-form-group">
              <label className="event-edit-form-label">Date</label>
              <input
                type="date"
                name="date"
                className="event-edit-form-input"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="event-edit-form-group">
              <label className="event-edit-form-label">Time</label>
              <input
                type="time"
                name="time"
                className="event-edit-form-input"
                value={formData.time}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="event-edit-form-group">
            <label className="event-edit-form-label">Location</label>
            <input
              type="text"
              name="location"
              className="event-edit-form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              disabled={isLoading}
            />
          </div>

          <div className="event-edit-form-actions">
            <button
              type="button"
              className="event-edit-btn event-edit-btn-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="event-edit-btn event-edit-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}