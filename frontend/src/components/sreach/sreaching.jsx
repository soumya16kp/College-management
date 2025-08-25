import React, { useState } from "react";
import "./searching.css";

const Searching = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleFilterOptions = () => {
    setShowOptions(prev => !prev);
  };

  return (
    <div className="search-container">
      <input className="search" placeholder="Search Clubs" />
      <div className="se-icon">
        <button><i className="fa-solid fa-magnifying-glass"></i></button>
      </div>
      <div className="filter-container">
        <button className="filter-button" onClick={toggleFilterOptions}>
          <i className="fa-solid fa-filter"></i>
        </button>
        {showOptions && (
          <div className="sort-container">
            <button className="sort-by-students">Sort by Students</button>
            <button className="sort-by-year">Sort by Year</button>
            <button className="sort-by-department">Sort by Department</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searching;
