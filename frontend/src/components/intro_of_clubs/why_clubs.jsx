import React from "react";
import "./why_clubs.css";
import skill from "../../assets/skill.png";
import network from "../../assets/network.png";
import boosts from "../../assets/boosts.png";
import career from "../../assets/career.png";
function Clubs() {
  const benefits = [
    {
      title: "Skill Development",
      description:
        "Improves communication, leadership, and teamwork skills.\n\nHelps you practice time management and organizational skills.\n\nMany clubs provide hands-on experience with technical or creative skills \n\n(e.g., coding, design, public speaking).",
      image: skill
    },
    {
      title: "Networking Opportunities",
      description:
        "You meet people with similar interests, which can lead to strong friendships.\n\nExpands your professional network through alumni or industry interactions.\n\nHelpful for future collaborations, internships, and job referrals.",
      image: network
    },
    {
      title: "Boosts Confidence",
      description:
        "Public speaking, event management, and social interaction build self-confidence.\n\nTaking up responsibilities like leading a\n\n team makes you more assertive and independent.",
      image: boosts
    },
    {
      title: "Academic & Career Advantage",
      description:
        "Adds value to your resume or CV.\n\nDemonstrates initiative, leadership qualities, and team experience to employers.\n\nCan provide certifications, projects, and real-world exposure relevant to your field.",
      image: career
    },
    {
      title: "Personal Growth",
      description:
        "Encourages creativity, innovation, and problem-solving.\n\nHelps you manage stress by balancing academics with fun and engaging activities.\n\nMakes you more adaptable and open to new ideas.",
      image: skill
    },
    {
      title: "Access to Resources",
      description:
        "Clubs often have access to workshops, seminars, and industry experts.\n\nMay provide funding for projects, hackathons, or competitions.",
      image: skill
    },
    {
      title: "Fun & Social Life",
      description:
        "Provides opportunities to make friends and socialize.\n\nMakes college life more enjoyable and memorable.\n\nIncludes trips, cultural events, and extracurricular excitement.",
      image: skill
    }
  ];

  return (
    <div className="clubs-container">
      <h1>The Benefits of Joining Clubs</h1>

      {benefits.map((benefit, index) => (
        <div className="benefits" key={index}>
          {index % 2 === 0 ? (
            <>
              <div className="image">
                <img src={benefit.image} alt={benefit.title} />
              </div>
              <div className="content">
                <div className="title">
                  <p>{benefit.title}</p>
                </div>
                <div className="description">
                  <p>{benefit.description}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="content">
                <div className="title">
                  <p>{benefit.title}</p>
                </div>
                <div className="description">
                  <p>{benefit.description}</p>
                </div>
              </div>
              <div className="image">
                <img src={benefit.image} alt={benefit.title} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Clubs;
