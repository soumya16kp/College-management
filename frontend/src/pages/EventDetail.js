import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import { FiMoreVertical, FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";
import EventEditForm from "../forms/EventEditForm";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedEvent, fetchEventDetail, removeEvent, loading, error } = useEvents();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEventDetail(id);
  }, [id, fetchEventDetail]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await removeEvent(id);
        navigate(-1); 
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (updatedEvent) => {
    console.log("Event updated successfully:", updatedEvent);
    setIsEditing(false);
    // The context already updates the state, so we don't need to do anything else
  };

  if (loading) return <div className="event-about-loading">Loading...</div>;
  if (error) return <div className="event-about-error">{error}</div>;
  if (!selectedEvent) return null;

  return (
    <div className="event-about-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FiArrowLeft /> Back
      </button>

      {/* Render the edit form as a modal */}
      {isEditing && (
        <EventEditForm
          event={selectedEvent}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="event-card">
        <div className="eventdetail-header">
          <h1>{selectedEvent.title}</h1>
          <div className="event-menu">
            <button className="menu-btn">
              <FiMoreVertical />
            </button>
            <div className="menu-dropdown">
              <button onClick={handleEdit}>
                <FiEdit /> Edit
              </button>
              <button onClick={handleDelete}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>

        <p className="event-description">{selectedEvent.description}</p>

        <div className="event-info">
          <p><strong>Date:</strong> {selectedEvent.date}</p>
          <p><strong>Time:</strong> {selectedEvent.time || "TBA"}</p>
          <p><strong>Location:</strong> {selectedEvent.location || "Not specified"}</p>
          {selectedEvent.club && (
            <p><strong>Organized by:</strong> {selectedEvent.club.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}