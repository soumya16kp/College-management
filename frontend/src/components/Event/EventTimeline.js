import React from 'react';
import './EventTimeline.css';

const EventTimeline = ({ timelineData }) => {
    if (!timelineData || timelineData.length === 0) {
        return null; // Or a placeholder if preferred
    }

    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Sort by date just in case
    const sortedTimeline = [...timelineData].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="event-timeline-section">
            <div className="timeline-container">
                {sortedTimeline.map((item, index) => {
                    const isPast = new Date(item.date) < new Date();

                    return (
                        <div key={item.id || index} className={`timeline-item ${isPast ? 'completed' : ''}`}>
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="timeline-date">{formatDate(item.date)}</span>
                                <h4>{item.title}</h4>
                                {item.description && <p>{item.description}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EventTimeline;
