import React from "react";

import errorIcon from "../assets/error.png";

import "./ErrorState.css";

function ErrorState({
  title = "Something went wrong",
  message = "We could not load this information. Please try again.",
  buttonText = "Try Again",
  onRetry,
  showButton = true
}) {
  return (
    <div className="saas-error-state">
      <div className="saas-error-icon">
        <img src={errorIcon} alt="" />
      </div>

      <div className="saas-error-content">
        <h3>{title}</h3>

        <p>{message}</p>
      </div>

      {showButton && onRetry && (
        <button
          type="button"
          className="saas-error-button"
          onClick={onRetry}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default ErrorState;