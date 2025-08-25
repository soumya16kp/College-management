
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/AuthSlice.js";
import authService from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import EventCarousel from "../components/Home_Components/EventSlideShow.js";
import WelcomingEvents from "../components/Home_Components/welcoming_events.jsx";
import Clubs from "../components/Home_Components/why_clubs.jsx";
import ClubsList from "../components/Home_Components/ClubSlideShow.js";
function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout(); 
      dispatch(authLogout());     
      navigate("/login");         
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
       <div>
         <EventCarousel/>
         <ClubsList classes={1}/>
         <WelcomingEvents />
         <Clubs/>
       </div>
    </>
  );
}

export default Home;
