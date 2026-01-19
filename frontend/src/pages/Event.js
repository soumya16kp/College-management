import { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/Card/EventCard';
import NoEvents from "../assets/ChatGPT Image Aug 28, 2025, 11_56_28 AM.png"
import "./Event.css";

function Event() {
  const [activeTab, setActiveTab] = useState("live");
  const { events, fetchAllEvents, loading } = useEvents();

  // const clubId = 1;

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);


  const time = new Date();
  const liveEvents = [];
  const upcomingEvents = [];
  const pastEvents = [];

  events.forEach(element => {
    const eventDate = new Date(element.date);
    const today = new Date(time.toDateString());
    const eventDay = new Date(eventDate.toDateString());

    if (eventDay.getTime() === today.getTime()) {
      liveEvents.push(element);
    } else if (eventDay > today) {
      upcomingEvents.push(element);
    } else {
      pastEvents.push(element);
    }
  });

  const getEventsByType = () => {
    switch (activeTab) {
      case "live": return liveEvents;
      case "upcoming": return upcomingEvents;
      case "past": return pastEvents;
      default: return [];
    }
  };

  const currentEvents = getEventsByType();

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Close dropdown when clicking outside (simple implementation)
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest('.mobile-tabs')) {
        setIsMobileDropdownOpen(false);
      }
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <div className="event-page">
      <div className="event-header">
        <h1>Club Events</h1>
        <p>Discover, participate, and engage with our diverse range of club activities</p>
      </div>

      <div className='tab-buttons'>
        {/* Desktop View */}
        <ul className="desktop-tabs">
          <li>
            <button
              className={activeTab === "live" ? "active" : ""}
              onClick={() => setActiveTab("live")}
            >
              Live Events
              {liveEvents.length > 0 && <span className="event-count">{liveEvents.length}</span>}
            </button>
          </li>
          <li>
            <button
              className={activeTab === "upcoming" ? "active" : ""}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Events
              {upcomingEvents.length > 0 && <span className="event-count">{upcomingEvents.length}</span>}
            </button>
          </li>
          <li>
            <button
              className={activeTab === "past" ? "active" : ""}
              onClick={() => setActiveTab("past")}
            >
              Past Events
              {pastEvents.length > 0 && <span className="event-count">{pastEvents.length}</span>}
            </button>
          </li>
        </ul>

        {/* Mobile View - Custom Dropdown */}
        <div className="mobile-tabs">
          <button
            className={`custom-dropdown-trigger ${isMobileDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
          >
            <span className="selected-text">
              {activeTab === 'live' ? 'Live Events' : activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              <span className="mobile-count">
                ({activeTab === 'live' ? liveEvents.length : activeTab === 'upcoming' ? upcomingEvents.length : pastEvents.length})
              </span>
            </span>
            <svg
              className="dropdown-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {isMobileDropdownOpen && (
            <ul className="custom-dropdown-menu">
              <li
                className={activeTab === 'live' ? 'selected' : ''}
                onClick={() => { setActiveTab('live'); setIsMobileDropdownOpen(false); }}
              >
                <span>Live Events</span>
                {liveEvents.length > 0 && <span className="option-count">{liveEvents.length}</span>}
              </li>
              <li
                className={activeTab === 'upcoming' ? 'selected' : ''}
                onClick={() => { setActiveTab('upcoming'); setIsMobileDropdownOpen(false); }}
              >
                <span>Upcoming Events</span>
                {upcomingEvents.length > 0 && <span className="option-count">{upcomingEvents.length}</span>}
              </li>
              <li
                className={activeTab === 'past' ? 'selected' : ''}
                onClick={() => { setActiveTab('past'); setIsMobileDropdownOpen(false); }}
              >
                <span>Past Events</span>
                {pastEvents.length > 0 && <span className="option-count">{pastEvents.length}</span>}
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="events-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading events...</p>
          </div>
        ) : currentEvents.length > 0 ? (
          <div className="events-grid">
            {currentEvents.map(event => (
              <EventCard key={event.id} event={event} type={activeTab} />
            ))}
          </div>
        ) : (
          <div className="no-events-container">
            <img
              src={NoEvents}
              alt="No events"
              className="no-events-image"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Event;