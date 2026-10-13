import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import logo from "../assets/logo.png";
import dashboardIcon from "../assets/dashboard.png";
import usersIcon from "../assets/users.png";
import customersIcon from "../assets/customers.png";
import subscriptionsIcon from "../assets/subscriptions.png";
import plansIcon from "../assets/plans.png";
import usageIcon from "../assets/usage.png";
import revenueIcon from "../assets/revenue.png";
import analyticsIcon from "../assets/analytics.png";
import settingsIcon from "../assets/settings.png";
import closeIcon from "../assets/close.png";
import menuIcon from "../assets/menu.png";

import "./Sidebar.css";

const menuItems = [
  {
    title: "Dashboard",
    path: "/Dashboard",
    icon: dashboardIcon
  },
  {
    title: "Users",
    path: "/Users",
    icon: usersIcon
  },
  {
    title: "Customers",
    path: "/Customers",
    icon: customersIcon
  },
  {
    title: "Subscriptions",
    path: "/Subscriptions",
    icon: subscriptionsIcon
  },
  {
    title: "Plans",
    path: "/Plans",
    icon: plansIcon
  },
  {
    title: "Usage",
    path: "/Usage",
    icon: usageIcon
  },
  {
    title: "Revenue",
    path: "/Revenue",
    icon: revenueIcon
  },
  {
    title: "Analytics",
    path: "/Analytics",
    icon: analyticsIcon
  },
  {
    title: "Settings",
    path: "/Settings",
    icon: settingsIcon
  }
];

function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className="saas-sidebar-mobile-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={sidebarOpen}
        aria-controls="saas-sidebar-navigation"
      >
        <img src={menuIcon} alt="" />
      </button>

      {sidebarOpen && (
        <div
          className="saas-sidebar-overlay saas-sidebar-overlay-open"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        id="saas-sidebar-navigation"
        className={
          sidebarOpen
            ? "saas-sidebar saas-sidebar-open"
            : "saas-sidebar"
        }
        aria-label="Sidebar"
      >
        <div className="saas-sidebar-header">
          <NavLink
            to="/Dashboard"
            end
            className="saas-sidebar-logo"
            onClick={closeSidebar}
          >
            <img src={logo} alt="SaaSify logo" />

            <div className="saas-sidebar-logo-text">
              <strong>SaaSify</strong>
              <span>Management</span>
            </div>
          </NavLink>

          <button
            type="button"
            className="saas-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <div className="saas-sidebar-workspace">
          <span className="saas-workspace-dot" aria-hidden="true" />

          <div>
            <strong>Pro Workspace</strong>
            <span>Business Account</span>
          </div>
        </div>

        <nav
          className="saas-sidebar-nav"
          aria-label="Main navigation"
        >
          <p className="saas-sidebar-section-title">MAIN MENU</p>

          <div className="saas-sidebar-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? "saas-sidebar-link active"
                    : "saas-sidebar-link"
                }
              >
                <span className="saas-sidebar-icon">
                  <img src={item.icon} alt="" />
                </span>

                <span className="saas-sidebar-link-text">
                  {item.title}
                </span>

                <span
                  className="saas-sidebar-active-dot"
                  aria-hidden="true"
                />
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="saas-sidebar-footer">
          <NavLink
            to="/Analytics"
            className="saas-sidebar-footer-card"
            onClick={closeSidebar}
          >
            <div className="saas-footer-icon">
              <img src={analyticsIcon} alt="" />
            </div>

            <div className="saas-footer-content">
              <strong>Analytics</strong>
              <span>View your growth</span>
            </div>

            <span
              className="saas-footer-status"
              aria-hidden="true"
            />
          </NavLink>

          <p className="saas-sidebar-version">
            SaaSify Dashboard · v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;