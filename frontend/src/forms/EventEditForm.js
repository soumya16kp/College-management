import { useState, useEffect } from "react";
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
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
    club: "",
    timeline: [],
    prizes: []
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
        club: event.club?.id || event.club || "",
        timeline: event.timeline ? [...event.timeline] : [],
        prizes: event.prizes ? [...event.prizes] : []
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

  // --- Timeline Handlers ---
  const handleAddTimeline = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { title: "", date: "", description: "", order: prev.timeline.length + 1 }]
    }));
  };

  const handleRemoveTimeline = (index) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      return { ...prev, timeline: newTimeline };
    });
  };

  // --- Prize Handlers ---
  const handleAddPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { prize_type: "", amount: "", description: "", icon: "trophy" }]
    }));
  };

  const handleRemovePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const handlePrizeChange = (index, field, value) => {
    setFormData(prev => {
      const newPrizes = [...prev.prizes];
      newPrizes[index] = { ...newPrizes[index], [field]: value };
      return { ...prev, prizes: newPrizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Use the context function to edit the event
      const updatedEvent = await editEvent(event.id, formData);

      if (onSave) {
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
          {/* Basic Info Section */}
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

          {/* Timeline Section */}
          <div className="event-edit-section">
            <div className="event-edit-section-header">
              <h3 className="event-edit-section-title">Timeline</h3>
              <button type="button" className="event-edit-add-btn" onClick={handleAddTimeline}>
                <FiPlus /> Add Stage
              </button>
            </div>

            <div className="event-edit-list">
              {formData.timeline.map((item, index) => (
                <div key={index} className="event-edit-list-item">
                  <button type="button" className="event-edit-remove-btn" onClick={() => handleRemoveTimeline(index)}>
                    <FiTrash2 />
                  </button>

                  <div className="event-edit-form-group">
                    <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Title</label>
                    <input
                      type="text"
                      className="event-edit-form-input"
                      value={item.title}
                      onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                      placeholder="e.g. Registration Starts"
                      required
                    />
                  </div>

                  <div className="event-edit-item-row">
                    <div className="event-edit-form-group">
                      <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Date/Time</label>
                      <input
                        type="datetime-local"
                        className="event-edit-form-input"
                        value={item.date ? new Date(item.date).toISOString().slice(0, 16) : ''}
                        onChange={(e) => handleTimelineChange(index, 'date', e.target.value)}
                        required
                      />
                    </div>
                    <div className="event-edit-form-group">
                      <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Order</label>
                      <input
                        type="number"
                        className="event-edit-form-input"
                        value={item.order}
                        onChange={(e) => handleTimelineChange(index, 'order', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="event-edit-form-group">
                    <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Description</label>
                    <input
                      type="text"
                      className="event-edit-form-input"
                      value={item.description || ''}
                      onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                      placeholder="Short description"
                    />
                  </div>
                </div>
              ))}
              {formData.timeline.length === 0 && (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>No timeline stages added yet.</p>
              )}
            </div>
          </div>

          {/* Prizes Section */}
          <div className="event-edit-section">
            <div className="event-edit-section-header">
              <h3 className="event-edit-section-title">Prizes & Rewards</h3>
              <button type="button" className="event-edit-add-btn" onClick={handleAddPrize}>
                <FiPlus /> Add Prize
              </button>
            </div>

            <div className="event-edit-list">
              {formData.prizes.map((item, index) => (
                <div key={index} className="event-edit-list-item">
                  <button type="button" className="event-edit-remove-btn" onClick={() => handleRemovePrize(index)}>
                    <FiTrash2 />
                  </button>

                  <div className="event-edit-item-row">
                    <div className="event-edit-form-group">
                      <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Prize Type</label>
                      <input
                        type="text"
                        className="event-edit-form-input"
                        value={item.prize_type}
                        onChange={(e) => handlePrizeChange(index, 'prize_type', e.target.value)}
                        placeholder="e.g. Winner"
                        required
                      />
                    </div>
                    <div className="event-edit-form-group">
                      <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Amount/Reward</label>
                      <input
                        type="text"
                        className="event-edit-form-input"
                        value={item.amount}
                        onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                        placeholder="e.g. ₹5,000"
                        required
                      />
                    </div>
                  </div>

                  <div className="event-edit-item-row">
                    <div className="event-edit-form-group">
                      <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Icon Type</label>
                      <select
                        className="event-edit-form-input"
                        value={item.icon || 'trophy'}
                        onChange={(e) => handlePrizeChange(index, 'icon', e.target.value)}
                      >
                        <option value="trophy">Trophy</option>
                        <option value="medal">Medal</option>
                        <option value="gift">Gift</option>
                      </select>
                    </div>
                  </div>

                  <div className="event-edit-form-group">
                    <label className="event-edit-form-label" style={{ fontSize: '0.85rem' }}>Description</label>
                    <input
                      type="text"
                      className="event-edit-form-input"
                      value={item.description || ''}
                      onChange={(e) => handlePrizeChange(index, 'description', e.target.value)}
                      placeholder="Additional details"
                    />
                  </div>
                </div>
              ))}
              {formData.prizes.length === 0 && (
                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>No prizes added yet.</p>
              )}
            </div>
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