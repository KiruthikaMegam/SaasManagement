
import React from "react";

import searchIcon from "../assets/search.png";
import filterIcon from "../assets/filter.png";
import closeIcon from "../assets/close.png";

import "./SearchFilter.css";

function SearchFilter({
  search,
  setSearch,
  value,
  onChange,
  placeholder = "Search...",
  onFilter,
  filterCount = 0,
  showFilter = true,
}) {
  // Support both search/setSearch and value/onChange.
  const searchValue = search !== undefined ? search : (value ?? "");

  const updateSearch = (newValue) => {
    if (typeof setSearch === "function") {
      setSearch(newValue);
    } else if (typeof onChange === "function") {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    updateSearch(event.target.value);
  };

  const handleClear = () => {
    updateSearch("");
  };

  const handleFilterClick = () => {
    if (typeof onFilter === "function") {
      onFilter();
    }
  };

  return (
    <div className="saas-search-filter">
      <div className="saas-search-box">
        <img
          src={searchIcon}
          alt=""
          className="saas-search-icon"
        />

        <input
          type="search"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
        />

        {searchValue !== "" && (
          <button
            type="button"
            className="saas-search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear search"
          >
            <img src={closeIcon} alt="" />
          </button>
        )}
      </div>

      {showFilter && (
        <button
          type="button"
          className="saas-filter-button"
          onClick={handleFilterClick}
          aria-label={
            filterCount > 0
              ? `Open filters, ${filterCount} active`
              : "Open filters"
          }
        >
          <img src={filterIcon} alt="" />

          <span>Filters</span>

          {filterCount > 0 && (
            <span
              className="saas-filter-count"
              aria-label={`${filterCount} active filters`}
            >
              {filterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default SearchFilter;