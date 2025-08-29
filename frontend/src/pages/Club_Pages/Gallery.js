import { useEffect, useState } from "react";
import { useEvents } from "../../context/EventContext";
import { useParams } from "react-router-dom";
import authService from "../../services/authService";
import GalleryForm from "../../forms/GalleryForm";
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUpload } from "react-icons/fi";
import { MdEvent, MdPhotoLibrary } from "react-icons/md";
import "./Gallery.css";

function Gallery() {
  const { id } = useParams();
  const { events, fetchEvents } = useEvents();
  const [galleries, setGalleries] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClubData();
    }
  }, [id]);

  const fetchClubData = async () => {
    try {
      setLoading(true);
      await fetchEvents(id);
      await fetchClubGalleries(id);
    } catch (error) {
      console.error("Error fetching club data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubGalleries = async (clubId) => {
    try {
      const res = await authService.apiClient.get(`/gallery/club/${clubId}/`);
      const data = res.data;

      const grouped = data.reduce((acc, g) => {
        if (!acc[g.event]) acc[g.event] = [];
        acc[g.event].push(g);
        return acc;
      }, {});
      setGalleries(grouped);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  };

  const handleImageUpload = () => {
    fetchClubGalleries(id);
    setSelectedEvent(null);
  };

  if (loading) return <div className="gallery-loading">Loading gallery...</div>;

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <MdPhotoLibrary className="gallery-header-icon" />
        <h2 className="gallery-title">Club Events Gallery</h2>
      </div>

      {events.length === 0 ? (
        <p className="gallery-empty">No events yet.</p>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div className="event-title-section">
                  <MdEvent className="event-icon" />
                  <h3 className="event-title">{event.title}</h3>
                </div>
                <button
                  className="upload-btn"
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                >
                  <FiUpload className="btn-icon" />
                  {selectedEvent === event.id ? "Cancel" : "Upload Images"}
                </button>
              </div>
              
              <div className="event-details">
                <div className="event-detail-item">
                  <FiCalendar className="detail-icon" />
                  <span>{event.date}</span>
                </div>
                <div className="event-detail-item">
                  <FiClock className="detail-icon" />
                  <span>{event.time}</span>
                </div>
                <div className="event-detail-item">
                  <FiMapPin className="detail-icon" />
                  <span>{event.location}</span>
                </div>
                <p className="event-description">{event.description}</p>
              </div>

              {selectedEvent === event.id && (
                <GalleryForm 
                  eventId={event.id} 
                  onUploadSuccess={handleImageUpload}
                />
              )}

              <div className="gallery-section">
                <div className="gallery-section-header">
                  <FiImage className="gallery-icon" />
                  <h4 className="gallery-subtitle">Event Gallery</h4>
                </div>
                {galleries[event.id]?.length ? (
                  <div className="gallery-grid">
                    {galleries[event.id].map((gallery) => (
                      <div key={gallery.id} className="gallery-item">
                        <img
                          src={gallery.image}
                          alt={`Gallery ${gallery.id}`}
                          className="gallery-image"
                        />
                        {gallery.title && (
                          <p className="gallery-caption">{gallery.title}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-gallery">No images for this event yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;