import React, { useState } from 'react';
import EventCarousel, { events } from "../components/Home_Components/EventSlideShow.js";
import ClubEvent from '../components/Home_Components/clubevent.js';
import "./Event.css";
function Event() {
  const [activeTab, setActiveTab] = useState("live");

  const time = new Date();
  const live = [];
  const upcoming = [];
  const past = [];
  console.log(upcoming);
  events.forEach(element => {
    const eventdate = new Date(element.date);
    const today = new Date(time.toDateString());
    const eventDay = new Date(eventdate.toDateString());

    if (eventDay.getTime() === today.getTime()) {
      live.push(element);
    } else if (eventDay > today) {
      upcoming.push(element);
    } else {
      past.push(element);
    }
  });

  return (
    <div>
      <EventCarousel />
      <div className='buttons'>
        <ul>
            <li>
              <button
                className={activeTab === "live" ? "active" : ""}
                onClick={() => setActiveTab("live")}
              >
                Live Events
              </button>
            </li>
            <li>
              <button
                className={activeTab === "upcoming" ? "active" : ""}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming Events
              </button>
            </li>
            <li>
              <button
                className={activeTab === "past" ? "active" : ""}
                onClick={() => setActiveTab("past")}
              >
                Past Events
              </button>
            </li>

        </ul>
      </div>

      <div>
        {activeTab === "live" && <ClubEvent events={live} type="live" />}
        {activeTab === "upcoming" && <ClubEvent events={upcoming} type="upcoming" />}
        {activeTab === "past" && <ClubEvent events={past} type="past" />}
      </div>
    </div>
  );
}

export default Event;
