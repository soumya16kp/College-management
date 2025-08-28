import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./EventSlideShow.css";

export const events = [
  {
    id: 1,
    title: "Tech Fest 2025",
    description: "Join us for the biggest annual tech festival with coding, AI, and robotics events.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
    date: "March 17, 2025",
    link: "https://example.com/tech-fest"
  },
  {
    id: 2,
    title: "Cultural Night",
    description: "An evening full of music, dance, and performances by talented artists.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    date: "April 5, 2025",
    link: "https://example.com/cultural-night"
  },
  {
    id: 3,
    title: "Sports Meet",
    description: "Witness the thrilling competitions and showcase of athletic talent.",
    image: "https://images.unsplash.com/photo-1505842465776-3d90f616310d?auto=format&fit=crop&w=800&q=80",
    date: "May 14, 2025",
    link: "https://example.com/sports-meet"
  },
  {
    id: 4,
    title: "Welcome Freshers",
    description: "A grand welcome event to kickstart your exciting college journey!",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
    date: "September 1, 2025",
    link: "https://example.com/freshers-welcome"
  }
];

const EventCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(0);
      setIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setDirection(0);
    setIndex((prev) => (prev + 1) % events.length);
  };


  const prevSlide = () => {
    setDirection(1);
    setIndex((prev) => (prev - 1 + events.length) % events.length);
  };

 
  const slideVariants = {
    enter: (direction) => ({
      x: direction === 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction === 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={events[index].id}
            className="carousel-slide"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 }
            }}
          >
            <img
              src={events[index].image}
              alt={events[index].title}
              className="carousel-image"
            />

            <div className="carousel-overlay">
              <div className="overlay-content">
                <div className="event-badge">Upcoming Event</div>
                <h2>{events[index].title}</h2>
                <p className="event-date">{events[index].date}</p>
                <p className="event-description">{events[index].description}</p>
                <a 
                  href={events[index].link} 
                  className="event-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Navigation Dots */}
        <div className="carousel-dots">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 0 : 1);
                setIndex(i);
              }}
              className={i === index ? "dot active" : "dot"}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="carousel-progress">
          <motion.div 
            className="progress-bar" 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={index}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;