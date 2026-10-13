import React from "react";

import "./StatusBadge.css";

function StatusBadge({ status = "Unknown" }) {
  const statusText = String(status);

  const normalizedStatus = statusText.toLowerCase();

  let statusClass = "saas-status-default";

  if (
    normalizedStatus === "active" ||
    normalizedStatus === "paid" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "success" ||
    normalizedStatus === "successful"
  ) {
    statusClass = "saas-status-success";
  } else if (
    normalizedStatus === "trial" ||
    normalizedStatus === "pending" ||
    normalizedStatus === "upcoming"
  ) {
    statusClass = "saas-status-warning";
  } else if (
    normalizedStatus === "inactive" ||
    normalizedStatus === "expired" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "failed" ||
    normalizedStatus === "past due" ||
    normalizedStatus === "overdue"
  ) {
    statusClass = "saas-status-danger";
  } else if (
    normalizedStatus === "ongoing" ||
    normalizedStatus === "processing"
  ) {
    statusClass = "saas-status-info";
  }

  return (
    <span className={`saas-status-badge ${statusClass}`}>
      <span className="saas-status-dot"></span>

      <span className="saas-status-text">
        {statusText}
      </span>
    </span>
  );
}

export default StatusBadge;