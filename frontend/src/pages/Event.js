import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/Card/EventCard';
import "./Event.css";

function Event() {
  const [activeTab, setActiveTab] = useState("live");
  const { events, fetchAllEvents, loading } = useEvents();
  
  const clubId = 1; 

  useEffect(() => {
    fetchAllEvents(clubId);
    console.log(events);
  }, [fetchAllEvents, clubId]);


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
    switch(activeTab) {
      case "live": return liveEvents;
      case "upcoming": return upcomingEvents;
      case "past": return pastEvents;
      default: return [];
    }
  };

  const currentEvents = getEventsByType();

  return (
    <div className="event-page">
      <div className="event-header">
        <h1>Club Events</h1>
        <p>Discover, participate, and engage with our diverse range of club activities</p>
      </div>

      <div className='tab-buttons'>
        <ul>
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
      </div>

      <div className="events-container">
        {loading ? (
          <div className="loading-spinner">Loading events...</div>
        ) : currentEvents.length > 0 ? (
          <div className="events-grid">
            {currentEvents.map(event => (
              
              <EventCard key={event.id} event={event} type={activeTab} />
            ))}
          </div>
        ) : (
          <div className="no-events-container">
            <img 
              src="/api/placeholder/400/300" 
              alt="No events" 
              className="no-events-image"
            />
            <p>No {activeTab} events found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Event;