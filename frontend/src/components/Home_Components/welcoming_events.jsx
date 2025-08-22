import React from "react";
import './welcoming_events.css'
import front from "../../assets/front_photo.png";
let i = 0;
function WelcomingEvents() {
    function Change(direction) {

    }
    return(
        <>
            <div className="main">
                <div className="arrow" onClick={Change("backward")}><i class="fa-solid fa-angle-left"></i></div>
                <div className="welcome-card" id='box0'>
                    <div className="front_image">
                        <img src={front} />
                    </div>
                    <div className="text">
                        <h1>Welcome to College Clubs Portal!</h1>
                        <p>Explore clubs,<br />
                            Join events, and <br /> Connect with your community.</p>
                    </div>
                </div>
                <div className="box1">
                    <div className="images">
                        <img src={front} />
                    </div>
                    <div className="text" id="box1">
                        <h1>AI Horizons: Exploring the Future of Artificial Intelligence</h1>
                        <p>By AI Club<br />Date : 25th August 2025<br />Time: 4:00 PM - 6:30 PM (IST)<br />
                        Dive into the world of Artificial Intelligence<br /> and Machine Learning with hands-on sessions,
                        <br /> Expert talks, 
                        <br />And live demos.</p>
                        <p>This event will cover</p>
                        <li>Latest AI trends and technologies</li>
                        <li>Hands-on sessions with AI tools</li>
                        <li>Expert talks from industry leaders</li>
                        <li>Networking opportunities with AI enthusiasts</li>
                    </div>
                </div>
                <div className="arrow" onClick={Change("forward")}><i class="fa-solid fa-angle-right"></i></div>
            </div>
        </>
    )
}
export default WelcomingEvents;