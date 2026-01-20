import { useEffect, useState, useRef } from "react";
import { useEvents } from "../../context/EventContext";
import { useClubs } from "../../context/ClubContext";
import { useParams } from "react-router-dom";
import authService from "../../services/authService";
import GalleryForm from "../../forms/GalleryForm";
import { FiCalendar, FiClock, FiMapPin, FiImage, FiUpload, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { MdEvent, MdPhotoLibrary } from "react-icons/md";
import "./Gallery.css";
import Loader from "../../components/PageLoader";
import { useMembers, roleWeights } from "../../context/MemberContext";
import PermissionModal from "../../components/PermissionModal";
import { getMediaUrl } from '../../services/media';

function Gallery() {
  const { id } = useParams();
  const { events, fetchEvents } = useEvents();
  const { clubGalleries, fetchClubGallery } = useClubs();
  const { userRole } = useMembers(); // Get userRole
  const [galleries, setGalleries] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndexes, setCurrentSlideIndexes] = useState({});
  const [selectedImage, setSelectedImage] = useState(null); // Lightbox state
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState({}); // Mobile details toggle state

  const toggleMobileDetails = (eventId) => {
    setMobileDetailsOpen(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Permission Modal State
  const [permissionModal, setPermissionModal] = useState({ isOpen: false, message: "" });



  useEffect(() => {
    if (id) {
      fetchClubData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Process data when clubGalleries changes or id changes
  useEffect(() => {
    if (clubGalleries[id]) {
      processGalleryData(clubGalleries[id]);
    }
  }, [clubGalleries, id]);

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

      // Parallel fetch if needed, but context handles caching
      await Promise.all([
        fetchEvents(id),
        fetchClubGallery(id)
      ]);

    } catch (error) {
      console.error("Error fetching club data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processGalleryData = (data) => {
    const grouped = data.reduce((acc, g) => {
      if (!acc[g.event]) acc[g.event] = [];
      acc[g.event].push(g);
      return acc;
    }, {});
    setGalleries(grouped);

    // Initialize slide indexes if not already set (preserve existing state if possible)
    // Only set for new keys or if empty
    setCurrentSlideIndexes(prev => {
      const next = { ...prev };
      Object.keys(grouped).forEach(eventId => {
        if (next[eventId] === undefined) {
          next[eventId] = 0;
        }
      });
      return next;
    });
  };

  const handleImageUpload = async () => {
    setLoading(true);
    await fetchClubGallery(id, true); // Force refresh context
    setLoading(false);
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

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <div className="gallery-header-content">
          <MdPhotoLibrary className="gallery-header-icon" />
          <div>
            <h1 className="gallery-title">Club Gallery</h1>
            <p>Discover the vibrant moments of our club </p>
          </div>
        </div>
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
                  onClick={() => {
                    const roleWeight = roleWeights[userRole] || 0;
                    if (roleWeight >= roleWeights.secretary) {
                      setSelectedEvent(selectedEvent === event.id ? null : event.id);
                    } else {
                      setPermissionModal({
                        isOpen: true,
                        message: "You do not have permission to upload photos to this gallery. (Secretary+ required)"
                      });
                    }
                  }}
                >
                  <FiUpload className="btn-icon" />
                  {selectedEvent === event.id ? "Cancel" : "Upload Images"}
                </button>
              </div>

              <div className="gallery-event-details">
                <button
                  className="mobile-details-toggle"
                  onClick={() => toggleMobileDetails(event.id)}
                >
                  <span>Event Info</span>
                  <FiChevronRight className={`toggle-icon ${mobileDetailsOpen[event.id] ? 'open' : ''}`} />
                </button>

                <div className={`event-detail-item-nav ${mobileDetailsOpen[event.id] ? 'mobile-open' : ''}`}>
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
              </div>

              {selectedEvent === event.id && (
                <GalleryForm
                  eventId={event.id}
                  onUploadSuccess={handleImageUpload}
                  onCancel={() => setSelectedEvent(null)}
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
                                src={getMediaUrl(gallery.image)}
                                alt={`Gallery ${index + 1}`}
                                className="slider-image"
                                onClick={() => openLightbox(getMediaUrl(gallery.image))}
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
                        <div
                          key={gallery.id}
                          className="gallery-item"
                          onClick={() => openLightbox(getMediaUrl(gallery.image))}
                        >
                          <img
                            src={getMediaUrl(gallery.image)}
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

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <FiX />
            </button>
            <img src={selectedImage} alt="Full view" className="lightbox-image" />
          </div>
        </div>
      )}

      {/* Permission Modal */}
      <PermissionModal
        isOpen={permissionModal.isOpen}
        onClose={() => setPermissionModal({ ...permissionModal, isOpen: false })}
        message={permissionModal.message}
      />
    </div>
  );
}

export default Gallery;