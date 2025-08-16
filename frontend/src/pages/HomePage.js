import React from "react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/AuthSlice";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import WelcomingEvents from "../components/home_page_components/welcoming_events.jsx";
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout(); // API call to backend if needed
      dispatch(authLogout());     // Update Redux state
      navigate("/login");         // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <WelcomingEvents />
    </div>
  );
}

export default Navbar;
