import { NavLink, Outlet, useParams } from "react-router-dom";

import "./ClubDetail.css"; // for styling

const ClubDetail = () => {
  const { id } = useParams();

  return (
    <div className="club-detail">
      {/* <h2 className="club-title">Club #{id}</h2> */}

      {/* Sub-header navigation */}
      <nav className="club-subnav">
        <NavLink to="about" className={({ isActive }) => (isActive ? "active" : "")}>
          About
        </NavLink>
        <NavLink to="contact" className={({ isActive }) => (isActive ? "active" : "")}>
          Contact
        </NavLink>
        <NavLink to="gallery" className={({ isActive }) => (isActive ? "active" : "")}>
          Gallery
        </NavLink>
        <NavLink to="members" className={({ isActive }) => (isActive ? "active" : "")}>
          Members
        </NavLink>
        <NavLink to="events" className={({ isActive }) => (isActive ? "active" : "")}>
          Events
        </NavLink>
      </nav>

      {/* Render nested route */}
      <div className="club-subcontent">
        <Outlet />
      </div>
    </div>
  );
};

export default ClubDetail;
