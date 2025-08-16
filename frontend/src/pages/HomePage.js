import React from "react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/AuthSlice";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

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
      <h1>hello</h1>
    <nav>
      {/* other nav content */}
    </nav>
    </div>
  );
}

export default Navbar;
