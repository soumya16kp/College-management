import { useEffect, useState, useRef } from "react";
import { useEvents } from "../../context/EventContext";
import { useParams } from "react-router-dom";
import authService from "../../services/authService";
import GalleryForm from "../../forms/GalleryForm";
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUpload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdEvent, MdPhotoLibrary } from "react-icons/md";
import "./Gallery.css";

function Gallery() {
  const { id } = useParams();
  const { events, fetchEvents } = useEvents();
  const [galleries, setGalleries] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndexes, setCurrentSlideIndexes] = useState({});
  const sliderRefs = useRef({});

  useEffect(() => {
    if (id) {
      fetchClubData();
    }
  }, [id]);

  useEffect(() => {
    const intervals = {};
    
    Object.keys(galleries).forEach(eventId => {
      if (galleries[eventId]?.length > 1) {
        intervals[eventId] = setInterval(() => {
          setCurrentSlideIndexes(prev => ({
            ...prev,
            [eventId]: (prev[eventId] + 1) % galleries[eventId].length
          }));
        }, 4000); 
      }
    });

    return () => {
      // Clean up intervals on component unmount
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [galleries]);

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
      
      // Initialize slide indexes
      const indexes = {};
      Object.keys(grouped).forEach(eventId => {
        indexes[eventId] = 0;
      });
      setCurrentSlideIndexes(indexes);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  };

  const handleImageUpload = () => {
    fetchClubGalleries(id);
    setSelectedEvent(null);
  };

  const nextSlide = (eventId) => {
    setCurrentSlideIndexes(prev => ({
      ...prev,
      [eventId]: (prev[eventId] + 1) % galleries[eventId].length
    }));
  };

  const prevSlide = (eventId) => {
    setCurrentSlideIndexes(prev => ({
      ...prev,
      [eventId]: (prev[eventId] - 1 + galleries[eventId].length) % galleries[eventId].length
    }));
  };

  const goToSlide = (eventId, index) => {
    setCurrentSlideIndexes(prev => ({
      ...prev,
      [eventId]: index
    }));
  };

  if (loading) return <div className="gallery-loading">Loading gallery...</div>;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <MdPhotoLibrary className="gallery-header-icon" />
        <h1 className="gallery-title">Club Gallery</h1>
      </div>

      {events.length === 0 ? (
        <div className="no-gallery">
          <MdPhotoLibrary className="gallery-icon" />
          <p>No events yet.</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="gallery-event-header">
                <div className="event-title-section">
                  <MdEvent className="event-icon" />
                  <h2 className="event-title">{event.title}</h2>
                </div>
                <button
                  className="upload-btn"
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                >
                  <FiUpload className="btn-icon" />
                  {selectedEvent === event.id ? "Cancel" : "Upload Images"}
                </button>
              </div>
              
              <div className="gallery-event-details">
                <div className="event-detail-item-nav">
                <div className="event-detail-item">
                  <FiCalendar className="detail-icon" />
                  <span>{event.date}</span>
                </div>
                <div className="event-detail-item">
                  <FiClock className="detail-icon" />
                  <span>{event.time}</span>
                </div>
                {event.location && (
                  <div className="event-detail-item">
                    <FiMapPin className="detail-icon" />
                    <span>{event.location}</span>
                  </div>
                )}
                </div>
                {event.description && (
                  <p className="gallery-event-description">{event.description}</p>
                )}
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
                  <h3 className="gallery-subtitle">Event Gallery</h3>
                </div>

                {galleries[event.id]?.length ? (
                  <>
                    {/* Image Slider */}
                    <div className="gallery-slider">
                      <div className="slider-container">
                        <div 
                          className="slider-track"
                          style={{ 
                            transform: `translateX(-${currentSlideIndexes[event.id] * 100}%)` 
                          }}
                        >
                          {galleries[event.id].map((gallery, index) => (
                            <div key={gallery.id} className="slider-slide">
                              <img
                                src={gallery.image}
                                alt={`Gallery ${index + 1}`}
                                className="slider-image"
                              />
                            </div>
                          ))}
                        </div>
                        
                        {galleries[event.id].length > 1 && (
                          <>
                            <button 
                              className="slider-nav slider-prev"
                              onClick={() => prevSlide(event.id)}
                            >
                              <FiChevronLeft />
                            </button>
                            <button 
                              className="slider-nav slider-next"
                              onClick={() => nextSlide(event.id)}
                            >
                              <FiChevronRight />
                            </button>
                            
                            <div className="slider-counter">
                              {currentSlideIndexes[event.id] + 1} / {galleries[event.id].length}
                            </div>
                            
                            <div className="slider-indicators">
                              {galleries[event.id].map((_, index) => (
                                <button
                                  key={index}
                                  className={`slider-indicator ${index === currentSlideIndexes[event.id] ? 'active' : ''}`}
                                  onClick={() => goToSlide(event.id, index)}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail Grid */}
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
                  </>
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