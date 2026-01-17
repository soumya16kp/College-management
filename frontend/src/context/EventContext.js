import { createContext, useContext, useState, useCallback } from "react";
import {
  getEvents,
  getAllEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";

const EventContext = createContext();

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);        // club-specific or global, depending on fetch
  const [eventCache, setEventCache] = useState({}); // Cache for events: { clubId: [events] }
  const [selectedEvent, setSelectedEvent] = useState(null); // single event detail
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchAllEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching all events:", error);
      setError("Failed to fetch all events");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Fetch events for a specific club
  const fetchEvents = useCallback(async (clubId, forceRefresh = false) => {
    if (!forceRefresh && eventCache[clubId]) {
      // Use cached data
      setEvents(eventCache[clubId]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEvents(clubId);
      setEvents(data);
      // Update cache
      setEventCache(prev => ({
        ...prev,
        [clubId]: data
      }));
    } catch (error) {
      console.error("Error fetching club events:", error);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [eventCache]);

  // 🔹 Fetch single event
  const fetchEventDetail = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventDetail(eventId);
      setSelectedEvent(data);
    } catch (error) {
      console.error("Error fetching event detail:", error);
      setError("Failed to fetch event detail");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Add new event 
  const addEvent = async (clubId, eventData) => {
    try {
      setError(null);
      console.log(eventData);
      const newEvent = await createEvent(clubId, eventData);

      // Update current list and cache
      setEvents((prev) => [...prev, newEvent]);
      setEventCache(prev => ({
        ...prev,
        [clubId]: [...(prev[clubId] || []), newEvent]
      }));

      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event");
      throw error;
    }
  };

  // 🔹 Update event
  const editEvent = async (eventId, eventData, clubId) => {
    try {
      setError(null);
      const updatedEvent = await updateEvent(eventId, eventData);

      // Update current list
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? updatedEvent : event))
      );

      // Update cache if clubId is provided
      if (clubId) {
        setEventCache(prev => ({
          ...prev,
          [clubId]: (prev[clubId] || []).map(event =>
            event.id === eventId ? updatedEvent : event
          )
        }));
      }

      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event");
      throw error;
    }
  };

  // 🔹 Delete event
  const removeEvent = async (eventId, clubId) => {
    try {
      setError(null);
      await deleteEvent(eventId);

      // Update current list
      setEvents((prev) => prev.filter((event) => event.id !== eventId));

      // Update cache
      // Note: We need to know which club this event belonged to efficiently update cache.
      // If clubId is passed, we can update specific cache key. 
      // If not, we might scan all keys or just invalidate. Scanning is safer here.
      setEventCache(prev => {
        const newCache = { ...prev };
        // If clubId is known, update only that. Otherwise iterate.
        if (clubId) {
          newCache[clubId] = newCache[clubId].filter(e => e.id !== eventId);
        } else {
          Object.keys(newCache).forEach(key => {
            newCache[key] = newCache[key].filter(e => e.id !== eventId);
          });
        }
        return newCache;
      });

    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
      throw error;
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        selectedEvent,
        loading,
        error,
        fetchAllEvents,
        fetchEvents,
        fetchEventDetail,
        addEvent,
        editEvent,
        removeEvent,
        setError,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
