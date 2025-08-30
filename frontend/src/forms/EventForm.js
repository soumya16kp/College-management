import { useState,useEffect } from "react";
import "./EventForm.css";

const EventForm = ({clubId, onAddEvent }) => {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", eventData);
    if (!eventData.title.trim()) return;
    console.log("Calling onAddEvent now...");
    onAddEvent(clubId, eventData);
    setEventData({
      title: "Coding Marathon 2025",
      date: "2025-10-10",
      time: "10:00",
      location: "Main Hall",
      description: "A 12-hour competitive coding event where participants solve algorithmic challenges to win exciting prizes.",
    });
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>Add New Event</h2>

      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={eventData.title}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={eventData.date}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="time"
        value={eventData.time}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={eventData.location}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Event Description"
        value={eventData.description}
        onChange={handleChange}
        rows="4"
      />

      <button type="submit" className="btn">➕ Add Event</button>
    </form>
  );
};

export default EventForm;
