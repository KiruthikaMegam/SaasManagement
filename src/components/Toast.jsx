import React, { useEffect } from "react";

import successIcon from "../assets/success.png";
import errorIcon from "../assets/error.png";
import closeIcon from "../assets/close.png";

import "./Toast.css";

function Toast({
  message = "",
  type = "success",
  isOpen = false,
  onClose,
  duration = 3500
}) {
  useEffect(() => {
    if (!isOpen || message === "") {
      return undefined;
    }

    if (typeof onClose !== "function") {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, message, duration, onClose]);

  if (!isOpen || message === "") {
    return null;
  }

  const safeType =
    type === "error" ||
    type === "warning" ||
    type === "info"
      ? type
      : "success";

  let icon = successIcon;
  let title = "Success";

  if (safeType === "error") {
    icon = errorIcon;
    title = "Error";
  } else if (safeType === "warning") {
    icon = errorIcon;
    title = "Warning";
  } else if (safeType === "info") {
    icon = successIcon;
    title = "Information";
  }

  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const safeDuration =
    typeof duration === "number" && duration > 0
      ? duration
      : 3500;

  return (
    <div
      className={`saas-toast saas-toast-${safeType}`}
      role="alert"
      aria-live="polite"
    >
      <div className="saas-toast-icon">
        <img
          src={icon}
          alt=""
        />
      </div>

      <div className="saas-toast-content">
        <strong>{title}</strong>

        <p>{message}</p>
      </div>

      <button
        type="button"
        className="saas-toast-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <img
          src={closeIcon}
          alt=""
        />
      </button>

      <div
        className="saas-toast-progress"
        style={{
          animationDuration: `${safeDuration}ms`
        }}
      ></div>
    </div>
  );
}

export default Toast;