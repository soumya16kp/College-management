import { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
// Icons
import { FiMenu, FiX, FiInfo, FiPhone, FiImage, FiUsers, FiCalendar, FiChevronRight } from "react-icons/fi";
import "./ClubDetail.css";

const ClubDetail = () => {
  const { id } = useParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="club-glass-layout">
      
      {/* Mobile Toggle (Floating Glass Button) */}
      <div className="mobile-glass-trigger">
        <button 
          className={`glass-toggle-btn ${isMobileMenuOpen ? "active" : ""}`} 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Glass Sidebar */}
      <aside className={`glass-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="glass-header">
          <span className="glass-subtitle">Club Dashboard</span>
          <h3 className="glass-title">#{id}</h3>
        </div>

        <nav className="glass-nav">
          <NavItem to="about" icon={<FiInfo />} label="About" closeMenu={() => setIsMobileMenuOpen(false)} />
          <NavItem to="contact" icon={<FiPhone />} label="Contact" closeMenu={() => setIsMobileMenuOpen(false)} />
          <NavItem to="gallery" icon={<FiImage />} label="Gallery" closeMenu={() => setIsMobileMenuOpen(false)} />
          <NavItem to="members" icon={<FiUsers />} label="Members" closeMenu={() => setIsMobileMenuOpen(false)} />
          <NavItem to="events" icon={<FiCalendar />} label="Events" closeMenu={() => setIsMobileMenuOpen(false)} />
        </nav>
      </aside>

      {/* Main Content (Transparent container) */}
      <div className="glass-content">
        <Outlet />
      </div>

      {/* Mobile Overlay (Click to close) */}
      <div 
        className={`glass-overlay ${isMobileMenuOpen ? "show" : ""}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

// Helper component to keep code clean
const NavItem = ({ to, icon, label, closeMenu }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => (isActive ? "glass-link active" : "glass-link")}
    onClick={closeMenu}
  >
    <span className="link-icon">{icon}</span>
    <span className="link-text">{label}</span>
    <FiChevronRight className="link-arrow" />
  </NavLink>
);

export default ClubDetail;