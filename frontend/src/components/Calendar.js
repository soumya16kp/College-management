import { useState } from "react";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { MdEvent, MdGroups, MdSchool, MdTheaters } from "react-icons/md";
import "./Calendar.css";

const CalendarOverview = ({ events }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
        const date = new Date(event.date).toLocaleDateString();
        if (!eventsByDate[date]) {
            eventsByDate[date] = [];
        }
        eventsByDate[date].push(event);
    });

    // Generate calendar days for current month
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const hasEventsOnDate = (day) => {
        if (!day) return false;
        const checkDate = new Date(year, month, day).toLocaleDateString();
        return eventsByDate[checkDate] && eventsByDate[checkDate].length > 0;
    };

    const getEventsForDate = (day) => {
        const checkDate = new Date(year, month, day).toLocaleDateString();
        return eventsByDate[checkDate] || [];
    };

    const getEventIcon = (eventType) => {
        switch (eventType) {
            case 'meeting': return <MdGroups size={16} />;
            case 'academic': return <MdSchool size={16} />;
            case 'cultural': return <MdTheaters size={16} />;
            default: return <MdEvent size={16} />;
        }
    };

    const getEventColor = (eventType) => {
        switch (eventType) {
            case 'meeting': return '#3b82f6';
            case 'academic': return '#8b5cf6';
            case 'cultural': return '#ec4899';
            default: return '#10b981';
        }
    };

    return (
        <div className="calendar-widget">
            <div className="calendar-month-display">
                <FiCalendar /> {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-label">{day}</div>
                ))}
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={`calendar-day ${!day ? 'empty' : ''} ${hasEventsOnDate(day) ? 'has-event' : ''} ${day === today.getDate() ? 'today' : ''}`}
                        onClick={() => day && hasEventsOnDate(day) && setSelectedDate(day)}
                    >
                        {day}
                        {hasEventsOnDate(day) && <span className="event-dot"></span>}
                    </div>
                ))}
            </div>

            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                <div className="calendar-events-list">
                    <h4>Events on {new Date(year, month, selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h4>
                    {getEventsForDate(selectedDate).map(event => (
                        <div
                            key={event.id}
                            className="calendar-event-item"
                            style={{ borderLeft: `4px solid ${getEventColor(event.event_type)}` }}
                        >
                            <div className="event-type-icon" style={{ color: getEventColor(event.event_type) }}>
                                {getEventIcon(event.event_type)}
                            </div>
                            <div className="event-details">
                                <h5>{event.title}</h5>
                                <div className="event-meta">
                                    <span><FiClock size={12} /> {event.time || 'All Day'}</span>
                                    {event.location && <span><FiMapPin size={12} /> {event.location}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalendarOverview;
