import React from "react";
import './welcoming_events.css'
import front from "../../assets/front_photo.png";
function WelcomingEvents() {
    return(
        <>
            <div className="main">
                <div className="arrow"><i class="fa-solid fa-angle-left"></i></div>
                <div className="welcome-card">
                    <div className="front_image">
                        <img src={front} />
                    </div>
                    <div className="text">
                        <h1>Welcome to College Clubs Portal!</h1>
                        <p>Explore clubs,<br />
                            Join events, and <br /> Connect with your community.</p>
                    </div>
                </div>
                <div className="arrow"><i class="fa-solid fa-angle-right"></i></div>
            </div>
        </>
    )
}
export default WelcomingEvents;