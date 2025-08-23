import React, { useState } from 'react';
import EventCarousel, { events } from "../components/Home_Components/EventSlideShow.js";
import ClubEvent from '../components/Home_Components/clubevent.js';

function Event() {
  const [activeTab, setActiveTab] = useState("live");

  const time = new Date();
  const live = [];
  const upcoming = [];
  const past = [];

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
      <div>
        <ul>
          <li><button onClick={() => setActiveTab("live")}>Live Events</button></li>
          <li><button onClick={() => setActiveTab("upcoming")}>Upcoming Events</button></li>
          <li><button onClick={() => setActiveTab("past")}>Past Events</button></li>
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
