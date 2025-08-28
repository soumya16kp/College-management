import React, { useState, useRef } from "react";
import "./searching.css";

const Searching = ({sort}) => {
  const [sortParameter, setSortParameter] = useState(false);
  const [Direction, setDirection] = useState(false);

  const sorted = [{
    parameter: "",
    direction: Direction,
    sortinghappening: sortParameter
  }];

  const sorting = (parameter) => {
    if (sortParameter === false && Direction === false) {
      setSortParameter(true);
      setDirection(false);
      sorted.push({
        parameter: parameter,
        direction: false,
        sortinghappening: true
      });
    } else if (sortParameter === true && Direction === false) {
      setDirection(true);
      sorted.push({
        parameter: parameter,
        direction: true,
        sortinghappening: true
      });
    } else if (sortParameter === true && Direction === true) {
      setDirection(false);
      setSortParameter(false);
      sorted.push({
        parameter: parameter,
        direction: false,
        sortinghappening: false
      });
    }
  };

  const inputRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const toggleFilterOptions = () => {
    setShowOptions(prev => !prev);
    setIsFilterActive(prev => !prev);
  };

  const handleSearchclick = () => {
    setIsSearchActive(prev => !prev);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
            <button onClick={() => { sorting("student") }} className="sort-by-students">Sort by Students</button>
            <button onClick={() => { sorting("year") }} className="sort-by-year">Sort by Year</button>
            <button onClick={() => { sorting("department") }} className="sort-by-department">Sort by Department</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searching;
