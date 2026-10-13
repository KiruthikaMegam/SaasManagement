import React, { useEffect, useId } from "react";

import closeIcon from "../assets/close.png";

import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title = "",
  subtitle = "",
  children,
  size = "medium",
  showClose = true
}) {
  const modalId = useId();

  const titleId = `saas-modal-title-${modalId}`;
  const subtitleId = `saas-modal-subtitle-${modalId}`;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalClass = `saas-modal saas-modal-${size}`;

  const labelledBy = title !== "" ? titleId : undefined;

  const describedBy = subtitle !== ""
    ? subtitleId
    : undefined;

  return (
    <div
      className="saas-modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        <div className="saas-modal-header">
          <div className="saas-modal-heading">
            {title !== "" && (
              <h2 id={titleId}>
                {title}
              </h2>
            )}

            {subtitle !== "" && (
              <p id={subtitleId}>
                {subtitle}
              </p>
            )}
          </div>

          {showClose && (
            <button
              type="button"
              className="saas-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <img
                src={closeIcon}
                alt=""
              />
            </button>
          )}
        </div>

        <div className="saas-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;