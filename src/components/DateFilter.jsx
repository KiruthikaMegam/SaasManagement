import React, { useEffect, useState } from "react";

import calendarIcon from "../assets/calendar.png";
import closeIcon from "../assets/close.png";

import "./DateFilter.css";

function DateFilter({
  startDate = "",
  endDate = "",
  setStartDate,
  setEndDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear
}) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    setLocalStartDate(startDate);
    setLocalEndDate(endDate);
  }, [startDate, endDate]);

  const updateStartDate = (value) => {
    if (typeof onStartDateChange === "function") {
      onStartDateChange(value);
    } else if (typeof setStartDate === "function") {
      setStartDate(value);
    }
  };

  const updateEndDate = (value) => {
    if (typeof onEndDateChange === "function") {
      onEndDateChange(value);
    } else if (typeof setEndDate === "function") {
      setEndDate(value);
    }
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;

    setLocalStartDate(value);
    setDateError("");

    if (value && localEndDate && value > localEndDate) {
      setDateError("From date cannot be after the To date.");
    }
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;

    setLocalEndDate(value);
    setDateError("");

    if (value && localStartDate && value < localStartDate) {
      setDateError("To date cannot be before the From date.");
    }
  };

  const handleApply = () => {
    if (
      localStartDate &&
      localEndDate &&
      localStartDate > localEndDate
    ) {
      setDateError("Please select a valid date range.");
      return;
    }

    setDateError("");

    updateStartDate(localStartDate);
    updateEndDate(localEndDate);

    if (typeof onApply === "function") {
      onApply(localStartDate, localEndDate);
    }
  };

  const handleClear = () => {
    setLocalStartDate("");
    setLocalEndDate("");
    setDateError("");

    updateStartDate("");
    updateEndDate("");

    if (typeof onClear === "function") {
      onClear();
    }
  };

  return (
    <div className="saas-date-filter">
      <div className="saas-date-filter-heading">
        <div className="saas-date-filter-icon">
          <img src={calendarIcon} alt="Date" />
        </div>

        <div>
          <strong>Date Range</strong>
          <span>Filter by period</span>
        </div>
      </div>

      <div className="saas-date-fields">
        <div className="saas-date-field">
          <label htmlFor="saas-start-date">From</label>

          <input
            id="saas-start-date"
            type="date"
            value={localStartDate}
            max={localEndDate || undefined}
            onChange={handleStartDateChange}
            aria-invalid={Boolean(dateError)}
          />
        </div>

        <span className="saas-date-arrow">→</span>

        <div className="saas-date-field">
          <label htmlFor="saas-end-date">To</label>

          <input
            id="saas-end-date"
            type="date"
            value={localEndDate}
            min={localStartDate || undefined}
            onChange={handleEndDateChange}
            aria-invalid={Boolean(dateError)}
          />
        </div>
      </div>

      {dateError && (
        <p className="saas-date-error" role="alert">
          {dateError}
        </p>
      )}

      <div className="saas-date-actions">
        <button
          type="button"
          className="saas-date-clear"
          onClick={handleClear}
        >
          <img src={closeIcon} alt="" />
          <span>Clear</span>
        </button>

        <button
          type="button"
          className="saas-date-apply"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default DateFilter;