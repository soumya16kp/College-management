import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/AuthSlice.js";
import authService from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import EventCarousel from "../components/HomeComponents/EventSlideShow.js";
import WelcomingEvents from "../components/HomeComponents/welcoming_events.jsx";
import Clubs from "../components/HomeComponents/why_clubs.jsx";
import ClubsList from "../components/HomeComponents/ClubSlideShow.js";
import CalendarOverview from "../components/Calendar.js";
import { FiActivity, FiCalendar, FiBell, FiInfo } from "react-icons/fi";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authService.apiClient.get("/clubs/home-data/");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="home-container">
      {/* Original Hero Carousel */}
      <EventCarousel />

      {/* Stats Section - Now Below Carousel */}
      {!loading && data && (
        <section className="stats-section">
          <div className="stat-card">
            <span className="stat-number">{data.stats.total_clubs}</span>
            <span className="stat-label">Active Clubs</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{data.stats.active_events}</span>
            <span className="stat-label">Upcoming Events</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{data.stats.total_students}</span>
            <span className="stat-label">Students Joined</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{data.stats.total_awards}</span>
            <span className="stat-label">Awards Won</span>
          </div>
        </section>
      )}

      {/* Today's Highlights */}
      {!loading && data && data.highlights && data.highlights.length > 0 && (
        <section className="highlights-section">
          <div className="section-header">
            <h2>Today's Highlights</h2>
            <p>Don't miss out on what's happening right now on campus.</p>
          </div>

          <div className="highlights-grid">
            {data.highlights.map(event => (
              <div key={event.id} className="highlight-card">
                <img src={event.image || '/api/placeholder/400/200'} alt={event.title} className="highlight-image" />
                <div className="highlight-content">
                  <span className="highlight-badge">Happening Today</span>
                  <h3 className="highlight-title">{event.title}</h3>
                  <div className="highlight-info">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiActivity /> {event.club?.name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiCalendar /> {event.time || 'All Day'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Original ClubsList */}
      <ClubsList classes={1} />

      {/* Welcoming Events */}
      <WelcomingEvents />

      {/* Notices & Calendar - Single Header with Side-by-Side Content */}
      {!loading && data && (
        <section className="notices-calendar-section">
          <div className="section-header">
            <h2>Announcements & Calendar</h2>
            <p>Stay updated with the latest news and track important dates.</p>
          </div>

          <div className="notices-calendar-wrapper">
            {/* Notices Content (Left) */}
            <div className="notices-container">
              {data.notices && data.notices.length > 0 ? (
                data.notices.map(notice => (
                  <div key={notice.id} className="notice-item">
                    <div className={`notice-icon-box ${notice.is_important ? 'important' : ''}`}>
                      {notice.is_important ? <FiBell size={24} /> : <FiInfo size={24} />}
                    </div>
                    <div className="notice-content">
                      <div className="notice-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0 }}>{notice.title}</h4>
                        <span style={{
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          background: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          color: '#64748b'
                        }}>
                          {notice.role}
                        </span>
                      </div>
                      <p>{notice.content}</p>
                      <div className="notice-meta">
                        <span>{new Date(notice.date_posted).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#94a3b8' }}>No new notices.</p>
              )}
            </div>

            {/* Calendar Content (Right) */}
            {data.calendar_events && data.calendar_events.length > 0 && (
              <CalendarOverview events={data.calendar_events} />
            )}
          </div>
        </section>
      )}

      {/* Original Clubs/Why Clubs */}
      <Clubs />
    </div>
  );
}

export default Home;
