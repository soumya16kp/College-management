import { createContext, useContext, useState, useCallback, useRef } from "react";
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
  const [events, setEvents] = useState([]);  
  const eventCache = useRef({}); 
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchAllEvents = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && eventCache.current['ALL']) {
      setEvents(eventCache.current['ALL']);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getAllEvents();
      setEvents(data);
      eventCache.current['ALL'] = data;
    } catch (error) {
      console.error("Error fetching all events:", error);
      setError("Failed to fetch all events");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Fetch events for a specific club
  const fetchEvents = useCallback(async (clubId, forceRefresh = false) => {
    if (!forceRefresh && eventCache.current[clubId]) {
      // Use cached data
      setEvents(eventCache.current[clubId]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEvents(clubId);
      setEvents(data);
      // Update cache
      eventCache.current[clubId] = data;
    } catch (error) {
      console.error("Error fetching club events:", error);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Fetch single event
  const fetchEventDetail = useCallback(async (eventId, forceRefresh = false) => {
    const cacheKey = `detail_${eventId}`;

    if (!forceRefresh && eventCache.current[cacheKey]) {
      setSelectedEvent(eventCache.current[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getEventDetail(eventId);
      setSelectedEvent(data);

      // Cache the detail
      eventCache.current[cacheKey] = data;
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

      // Update current list
      setEvents((prev) => [...prev, newEvent]);

      // Update cache
      if (eventCache.current[clubId]) {
        eventCache.current[clubId] = [...eventCache.current[clubId], newEvent];
      }
      if (eventCache.current['ALL']) {
        eventCache.current['ALL'] = [...eventCache.current['ALL'], newEvent];
      }

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

      eventCache.current[`detail_${eventId}`] = updatedEvent;

      const updateList = (list) => list.map(event => event.id === eventId ? updatedEvent : event);

      if (clubId && eventCache.current[clubId]) {
        eventCache.current[clubId] = updateList(eventCache.current[clubId]);
      }

      if (eventCache.current['ALL']) {
        eventCache.current['ALL'] = updateList(eventCache.current['ALL']);
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
      delete eventCache.current[`detail_${eventId}`];

      const removeFromList = (list) => list.filter(e => e.id !== eventId);

      if (eventCache.current['ALL']) {
        eventCache.current['ALL'] = removeFromList(eventCache.current['ALL']);
      }

      if (clubId) {
        if (eventCache.current[clubId]) {
          eventCache.current[clubId] = removeFromList(eventCache.current[clubId]);
        }
      } else {
        Object.keys(eventCache.current).forEach(key => {
          if (Array.isArray(eventCache.current[key])) {
            eventCache.current[key] = removeFromList(eventCache.current[key]);
          }
        });
      }

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
