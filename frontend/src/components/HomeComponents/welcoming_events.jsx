import React from "react";
import './welcoming_events.css'
import front from "../../assets/front_photo.png";
let i = 0;
function WelcomingEvents() {
    function Change(direction) {

    }
    return (
        <>
            <div className="main">
                <div className="welcome-card" id='box0'>
                    <div className="front_image">
                        <img src={front} alt="Welcome" />
                    </div>
                    <div className="text">
                        <h1>Welcome to College Clubs Portal!</h1>
                        <p>Explore clubs,<br />
                            Join events, and <br /> Connect with your community.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default WelcomingEvents;