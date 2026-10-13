import React, { useEffect } from "react";

import closeIcon from "../assets/close.png";
import deleteIcon from "../assets/delete.png";

import "./ConfirmModal.css";

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger"
}) {
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

  const modalClass =
    type === "warning"
      ? "saas-confirm-modal saas-confirm-warning"
      : "saas-confirm-modal saas-confirm-danger";

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div
      className="saas-confirm-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="saas-confirm-title"
      >
        <button
          type="button"
          className="saas-confirm-close"
          onClick={onClose}
          aria-label="Close confirmation"
        >
          <img
            src={closeIcon}
            alt="Close"
          />
        </button>

        <div className="saas-confirm-icon">
          <img
            src={deleteIcon}
            alt=""
          />
        </div>

        <div className="saas-confirm-content">
          <h2 id="saas-confirm-title">
            {title}
          </h2>

          <p>
            {message}
          </p>
        </div>

        <div className="saas-confirm-actions">
          <button
            type="button"
            className="saas-confirm-cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="saas-confirm-submit"
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;