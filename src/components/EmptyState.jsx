import React from "react";

import emptyIcon from "../assets/empty.png";
import plusIcon from "../assets/plus.png";

import "./EmptyState.css";

function EmptyState({
  title = "No records found",
  message = "There are no records available at the moment.",
  buttonText = "Add New",
  onAction,
  showButton = false
}) {
  return (
    <div className="saas-empty-state">
      <div className="saas-empty-icon">
        <img
          src={emptyIcon}
          alt=""
        />
      </div>

      <div className="saas-empty-content">
        <h3>{title}</h3>

        <p>{message}</p>
      </div>

      {showButton && onAction && (
        <button
          type="button"
          className="saas-empty-button"
          onClick={onAction}
        >
          <img
            src={plusIcon}
            alt=""
          />

          <span>{buttonText}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;