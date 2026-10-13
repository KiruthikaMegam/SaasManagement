import React from "react";

import "./Loader.css";

function Loader({
  text = "Loading...",
  fullScreen = false
}) {
  const loaderClass = fullScreen
    ? "saas-loader saas-loader-fullscreen"
    : "saas-loader";

  return (
    <div className={loaderClass}>
      <div className="saas-loader-card">
        <div className="saas-loader-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>{text}</p>
      </div>
    </div>
  );
}

export default Loader;