import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./Layout.css";

function Layout() {
  return (
    <div className="saas-layout">
      <Sidebar />

      <div className="saas-main">
        <Topbar />

        <main className="saas-content">
          <div className="saas-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;