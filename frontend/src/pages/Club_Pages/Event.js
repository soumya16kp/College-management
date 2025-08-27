import { useEffect } from "react";
import EventForm from "../../forms/EventForm";
import { useEvents } from "../../context/EventContext"; // adjust path if needed
import { useParams } from "react-router-dom"; // assuming id comes from URL

function ClubEvent() {
  const { id } = useParams(); 
  const { events, fetchEvents, addEvent, removeEvent } = useEvents();

  useEffect(() => {
    if (id) {
      fetchEvents(id);
      console.log(id)
    }
  }, [id, fetchEvents]);

  const handleAddEvent = (clubId, eventData) => {
    if (clubId) {
      console.log("first")
      addEvent(clubId, eventData);
      console.log("corn")
    }
  };


  return (
    <div>

      <EventForm clubId={id} onAddEvent={handleAddEvent} />
      <h2>Club Events</h2>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {event.date} {event.time} @{" "}
              {event.location}
              <p>{event.description}</p>
              <button onClick={() => removeEvent(event.id)}>❌ Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClubEvent;
