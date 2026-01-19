import React from 'react';
import { FiAward, FiGift } from 'react-icons/fi'; // Icons
import { FaTrophy, FaMedal } from 'react-icons/fa'; // More specific icons
import './EventPrizes.css';

const EventPrizes = ({ prizesData }) => {
    if (!prizesData || prizesData.length === 0) {
        return null;
    }

    const getRankClass = (title) => {
        const t = title.toLowerCase();
        if (t.includes('winner') || t.includes('1st')) return 'rank-winner';
        if (t.includes('runner') || t.includes('2nd')) return 'rank-runner-1';
        if (t.includes('3rd')) return 'rank-runner-2';
        return '';
    };

    const getIcon = (title, iconType) => {
        const t = title.toLowerCase();
        if (t.includes('winner') || t.includes('1st')) return <FaTrophy />;
        if (t.includes('runner') || t.includes('2nd') || t.includes('3rd')) return <FaMedal />;
        if (iconType === 'gift') return <FiGift />;
        return <FiAward />;
    };

    return (
        <div className="event-prizes-section">
            <div className="prizes-grid">
                {prizesData.map((prize, index) => (
                    <div key={prize.id || index} className={`prize-card ${getRankClass(prize.prize_type)}`}>
                        <div className="prize-icon-container">
                            {getIcon(prize.prize_type, prize.icon)}
                        </div>
                        <div className="prize-details">
                            <span className="prize-type">{prize.prize_type}</span>
                            <span className="prize-amount">{prize.amount}</span>
                            {prize.description && <p className="prize-desc">{prize.description}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventPrizes;
