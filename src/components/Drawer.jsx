import React, { useEffect } from "react";

import closeIcon from "../assets/close.png";

import "./Drawer.css";

function Drawer({
  isOpen,
  onClose,
  title = "",
  subtitle = "",
  children,
  position = "right",
  width = "420px"
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

  const drawerClass =
    position === "left"
      ? "saas-drawer saas-drawer-left"
      : "saas-drawer saas-drawer-right";

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="saas-drawer-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className={drawerClass}
        style={{ "--drawer-width": width }}
        role="dialog"
        aria-modal="true"
      >
        <div className="saas-drawer-header">
          <div className="saas-drawer-heading">
            {title !== "" && (
              <h2>{title}</h2>
            )}

            {subtitle !== "" && (
              <p>{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            className="saas-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <img
              src={closeIcon}
              alt="Close"
            />
          </button>
        </div>

        <div className="saas-drawer-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;