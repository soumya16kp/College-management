import React from "react";
import "./card.css";
import { Link } from "react-router-dom";
import ai from "../../assets/card1.png";

function Card() {
  const box = [
    {
      img: ai,
      title: "Artificial Intelligence Club",
      description: "Learn about the latest in AI technology."
    }
  ];

  return (
    <>
        <div className="card-container">
                        <div className="card">
    <img className="card-img" src={box[0].img} alt={box[0].title} />
      <div className="card-content">
        <h2>{box[0].title}</h2>
        <p>{box[0].description}</p>
        <Link to="/club-details">
          <button className="card-btn">Learn More</button>
        </Link>
      </div>
    </div>
    </div>
    </>
  );
}

export default Card;
