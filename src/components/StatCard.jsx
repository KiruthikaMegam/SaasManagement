import React from "react";

import arrowRightIcon from "../assets/arrow-right.png";

import "./StatCard.css";

function StatCard({
  title,
  value,
  icon,
  change = "",
  changeType = "positive",
  subtitle = "",
  accent = "#ff4e7c",
  onClick
}) {
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };

  return (
    <div
      className="saas-stat-card"
      style={{
        "--stat-accent": accent
      }}
    >
      <div className="saas-stat-card-decoration"></div>

      <div className="saas-stat-card-top">
        <div className="saas-stat-icon">
          <img
            src={icon}
            alt=""
          />
        </div>

        {change !== "" && (
          <span
            className={
              changeType === "negative"
                ? "saas-stat-change saas-stat-change-negative"
                : "saas-stat-change"
            }
          >
            {change}
          </span>
        )}
      </div>

      <div className="saas-stat-card-content">
        <p className="saas-stat-title">
          {title}
        </p>

        <h2 className="saas-stat-value">
          {value}
        </h2>

        {subtitle !== "" && (
          <p className="saas-stat-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      <div className="saas-stat-card-bottom">
        <div className="saas-stat-progress">
          <span></span>
        </div>

        {typeof onClick === "function" && (
          <button
            type="button"
            className="saas-stat-arrow"
            onClick={handleClick}
            aria-label={`View ${title}`}
          >
            <img
              src={arrowRightIcon}
              alt=""
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default StatCard;