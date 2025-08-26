import React, { useState, useRef } from "react";
import "./searching.css";

const Searching = () => {
  const inputRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const toggleFilterOptions = () => {
    setShowOptions(prev => !prev);
    setIsFilterActive(prev => !prev); 
  };
  const handleSearchclick = () =>{
    setIsSearchActive(prev => !prev);
    if(inputRef.current){
      inputRef.current.focus();
    }
  }
  return (
    <div className="search-container">
      <input ref={inputRef} className="search" placeholder="Search Clubs" />
      <div className="se-icon">
        <button onClick={handleSearchclick} 
        className={isSearchActive ? "active" : ""}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
      <div className="filter-container">
        <button
          className={`filter-button ${isFilterActive ? "active" : ""}`}
          onClick={toggleFilterOptions}

        >
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
