import { useState } from "react";
import "../../pages/Event.css";
import notfound from "../../assets/notfound.png";
function ClubEvent({ events = [], type }) {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <div>
      <section className="clubs-section">
        <div className="clubs-grid">
          {events.length > 0 ? (
            events.map((event, index) => (
              <div
                className={`club-card ${activeCard === index ? "active" : ""}`}
                key={index}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="club-image-wrapper">
                  <img src={event.image} alt={event.title} className="club-image" />
                  <div className="club-overlay">
                    <div className="club-content">
                      <h3>{event.title}</h3>
                      <p>{event.date}</p>
                      <p>{event.description}</p>
                      <button className="club-join-btn1" title="Total People Enrolled"><i class="fa-regular fa-user"></i>&nbsp;100</button>
                      <button className="club-join-btn">Learn More</button>
                    </div>
                  </div>
                  <div className="club-badge">{event.title}</div>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="no-events-container">
                <img className="no-events-image" src={notfound} alt="No events found" />
                <p className="no-events-message">No {type} events right now.</p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default ClubEvent;