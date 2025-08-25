import React from "react";

const Searching = () => {
  return (
    <div className="search-container">
      <input className="search" placeholder="search Amazon" />
      <div className="se-icon">
        <i className="fa-solid fa-magnifying-glass"></i>
      </div>
            <div className="filter-icon">
        <i className="fa-solid fa-filter"></i>
      </div>
    </div>
  );
};

export default Searching;
