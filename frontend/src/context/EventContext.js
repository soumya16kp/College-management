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
  const [selectedEvent, setSelectedEvent] = useState(null); // single event detail
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch all events (global)
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
  const fetchEvents = useCallback(async (clubId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents(clubId);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching club events:", error);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, []);

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
      const newEvent = await createEvent(clubId, eventData);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event");
      throw error;
    }
  };

  // 🔹 Update event
  const editEvent = async (eventId, eventData) => {
    try {
      setError(null);
      const updatedEvent = await updateEvent(eventId, eventData);
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? updatedEvent : event))
      );
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event");
      throw error;
    }
  };

  // 🔹 Delete event
  const removeEvent = async (eventId) => {
    try {
      setError(null);
      await deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
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
