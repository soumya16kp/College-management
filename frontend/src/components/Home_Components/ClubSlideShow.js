import { useState } from "react";
import "./ClubSlideShow.css";
import Searching from "../sreach/sreaching";
const clubs = [
  {
    total_students: 100,
    made: "2020",
    name: "Coding Club",
    description:
      "A community of programmers who organize coding contests, hackathons, and workshops.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    total_students: 150,
    made: "2021",
    name: "Cultural Club",
    description:
      "Celebrate diversity through dance, music, and cultural festivals throughout the year.",
    image:
      "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80",
  },
  {
    total_students: 200,
    made: "2022",
    name: "Sports Club",
    description:
      "Promotes fitness and teamwork through various indoor and outdoor sports events.",
    image:
      "https://images.unsplash.com/photo-1505842465776-3d90f616310d?auto=format&fit=crop&w=800&q=80",
  },
  {
    total_students: 250,
    made: "2023",
    name: "Robotics Club",
    description:
      "Hands-on learning with robotics, electronics, and AI-driven projects.",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6b92c5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    total_students: 300,
    made: "2025",
    name: "Photography Club",
    description:
      "Capture memories and moments with creative photography and editing workshops.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
];

function ClubsList({ classes }) {

  const sorting = (info) =>{
    console.log(info);
    console.log("Hello")
  }

  const [activeCard, setActiveCard] = useState(null);

  return (
    <section className="clubs-section">
      {classes === 1? (
        <>
      <div className="clubs-header">
        <h2>Explore Our Clubs</h2>
        <p>Join vibrant student communities and discover your passion.</p>
      </div>

      <div className="clubs-grid">
        {clubs.map((club, index) => (
          <div 
            className={`club-card ${activeCard === index ? 'active' : ''}`} 
            key={index}
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="club-image-wrapper">
              <img src={club.image} alt={club.name} className="club-image" />
              <div className="club-overlay">
                <div className="club-content">
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                  <button className="club-join-btn">Learn More</button>
                </div>
              </div>
              <div className="club-badge">{club.name}</div>
            </div>
          </div>
        ))}
      </div>
      </>
      ):(
        <>
              <div className="clubs-header">
        <h2>Explore Our Clubs</h2>
        <p>Join vibrant student communities and discover your passion.</p>
      </div>
      <Searching sort={sorting} />
      <div className="clubs-grid">
        {clubs.map((club, index) => (
          <div 
            className={`club-card ${activeCard === index ? 'active' : ''}`} 
            key={index}
            onMouseEnter={() => setActiveCard(index)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className="club-image-wrapper">
              <img src={club.image} alt={club.name} className="club-image" />
              <div className="club-overlay">
                <div className="club-content">
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                  <button className="club-join-btn">Learn More</button>
                </div>
              </div>
              <div className="club-badge">{club.name}</div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </section>
  );
}

export default ClubsList;