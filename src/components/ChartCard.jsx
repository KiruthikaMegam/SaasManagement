import React from "react";

import downloadIcon from "../assets/download.png";

import "./ChartCard.css";

function ChartCard({
  title,
  subtitle = "",
  children,
  actionText = "Download",
  onAction,
  wide = false
}) {
  const cardClass = wide
    ? "saas-chart-card saas-chart-card-wide"
    : "saas-chart-card";

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className={cardClass}>
      <div className="saas-chart-decoration"></div>

      <div className="saas-chart-header">
        <div className="saas-chart-heading">
          <h3>{title}</h3>

          {subtitle !== "" && (
            <p>{subtitle}</p>
          )}
        </div>

        {onAction && (
          <button
            type="button"
            className="saas-chart-action"
            onClick={handleAction}
          >
            <img
              src={downloadIcon}
              alt=""
            />

            <span>{actionText}</span>
          </button>
        )}
      </div>

      <div className="saas-chart-body">
        {children}
      </div>
    </div>
  );
}

export default ChartCard;