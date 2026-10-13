import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import searchIcon from "../assets/search.png";
import notificationIcon from "../assets/notification.png";
import profileIcon from "../assets/profile.png";
import closeIcon from "../assets/close.png";

import "./Topbar.css";

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { users, customers, subscriptions, payments } = useSaaS();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("saasCurrentUser") || "null"
      );
    } catch {
      return null;
    }
  });

  const profileName = currentUser?.name || "Kiruthika";
  const profileEmail = currentUser?.email || "Administrator";

  const pageTitles = {
    "/Dashboard": {
      title: "Good morning, " + profileName ,
      subtitle: "Here's what's happening with your SaaS business today."
    },
    "/Users": {
      title: "Users",
      subtitle: "Manage your platform users and access."
    },
    "/Customers": {
      title: "Customers",
      subtitle: "Manage your business customers."
    },
    "/Subscriptions": {
      title: "Subscriptions",
      subtitle: "Track plans, billing and subscription status."
    },
    "/Plans": {
      title: "Pricing Plans",
      subtitle: "Create and manage your SaaS pricing plans."
    },
    "/Usage": {
      title: "Usage Analytics",
      subtitle: "Monitor platform usage and customer activity."
    },
    "/Revenue": {
      title: "Revenue",
      subtitle: "Track revenue, MRR and financial performance."
    },
    "/Analytics": {
      title: "Analytics",
      subtitle: "Compare your SaaS business performance."
    },
    "/Settings": {
      title: "Settings",
      subtitle: "Manage your account and workspace settings."
    }
  };

  const currentPage = pageTitles[location.pathname] || {
    title: "SaaS Management",
    subtitle: "Manage your SaaS business from one place."
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setSearchValue("");
    setSearchResults([]);
    setProfileOpen(false);
    setNotificationOpen(false);

    try {
      setCurrentUser(
        JSON.parse(localStorage.getItem("saasCurrentUser") || "null")
      );
    } catch {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value === "") {
      setSearchResults([]);
      return;
    }

    const query = value.toLowerCase();
    const results = [];

    const searchCollections = [
      { label: "Users", path: "/Users", data: users },
      { label: "Customers", path: "/Customers", data: customers },
      {
        label: "Subscriptions",
        path: "/Subscriptions",
        data: subscriptions
      },
      { label: "Payments", path: "/Revenue", data: payments }
    ];

    for (const collection of searchCollections) {
      for (const item of collection.data || []) {
        const searchableText = Object.values(item)
          .filter((value) => value !== null && value !== undefined)
          .join(" ")
          .toLowerCase();

        if (searchableText.includes(query)) {
          results.push({
            label: collection.label,
            title:
              item.name ||
              item.email ||
              item.company ||
              item.planName ||
              item.id ||
              collection.label,
            path: collection.path,
            id: item.id
          });
        }
      }
    }

    setSearchResults(results.slice(0, 8));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchOpen(false);
      setSearchValue("");
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setSearchOpen(false);
    setSearchValue("");
    setSearchResults([]);
  };

  const handleNotificationClick = () => {
    setNotificationOpen((previousValue) => !previousValue);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen((previousValue) => !previousValue);
    setNotificationOpen(false);
    setSearchOpen(false);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  const handleSearchClose = () => {
    setSearchValue("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("saasLogin");
    localStorage.removeItem("saasCurrentUser");
    setCurrentUser(null);
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  const handleSettings = () => {
    setProfileOpen(false);
    navigate("/Settings");
  };

  const handleProfile = () => {
    setProfileOpen(false);
    navigate("/Settings");
  };

  return (
    <header className="saas-topbar">
      <div className="saas-topbar-left">
        <div className="saas-topbar-heading">
          <h1>{currentPage.title}</h1>
          <p>{currentPage.subtitle}</p>
        </div>
      </div>

      <div className="saas-topbar-right">
        {/* SEARCH */}
        <div
          className={
            searchOpen
              ? "saas-topbar-search saas-topbar-search-open"
              : "saas-topbar-search"
          }
          ref={searchRef}
        >
          <form onSubmit={handleSearchSubmit} role="search">
            <button
              type="button"
              className="saas-topbar-search-button"
              onClick={handleSearchOpen}
              aria-label="Open search"
            >
              <img src={searchIcon} alt="" />
            </button>

            {searchOpen && (
              <>
                <input
                  type="search"
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search users, customers..."
                  aria-label="Search dashboard data"
                  autoFocus
                />

                <button
                  type="button"
                  className="saas-topbar-search-close"
                  onClick={handleSearchClose}
                  aria-label="Close search"
                >
                  <img src={closeIcon} alt="" />
                </button>
              </>
            )}
          </form>

          {searchOpen && searchValue !== "" && (
            <div className="saas-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <button
                    type="button"
                    key={`${result.label}-${result.id}-${index}`}
                    className="saas-search-result"
                    onClick={() => handleResultClick(result)}
                  >
                    <span>
                      <strong>{result.title}</strong>
                      <small>{result.label}</small>
                    </span>
                    <span className="saas-search-result-arrow">→</span>
                  </button>
                ))
              ) : (
                <p className="saas-search-empty">No matching records found.</p>
              )}
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div
          className="saas-topbar-panel-wrapper"
          ref={notificationRef}
        >
          <button
            type="button"
            className="saas-topbar-icon-button"
            onClick={handleNotificationClick}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <img src={notificationIcon} alt="" />
            <span className="saas-notification-dot" aria-hidden="true" />
          </button>

          {notificationOpen && (
            <div
              className="saas-notification-panel"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="saas-panel-header">
                <div>
                  <strong>Notifications</strong>
                  <span>Recent updates</span>
                </div>

                <button
                  type="button"
                  onClick={() => setNotificationOpen(false)}
                  aria-label="Close notifications"
                >
                  <img src={closeIcon} alt="" />
                </button>
              </div>

              <div className="saas-notification-list">
                <div className="saas-notification-item">
                  <span className="saas-notification-mark" />
                  <div>
                    <strong>Subscription management</strong>
                    <p>Review the latest subscription records.</p>
                    <small>Open Subscriptions to view details.</small>
                  </div>
                </div>

                <div className="saas-notification-item">
                  <span className="saas-notification-mark" />
                  <div>
                    <strong>Payment management</strong>
                    <p>Review recent payment information.</p>
                    <small>Open Revenue to view payment data.</small>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="saas-view-all-button"
                onClick={() => {
                  setNotificationOpen(false);
                  navigate("/Analytics");
                }}
              >
                View analytics
              </button>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          className="saas-topbar-panel-wrapper"
          ref={profileRef}
        >
          <button
            type="button"
            className="saas-profile-button"
            onClick={handleProfileClick}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            <img src={profileIcon} alt="" />

            <span className="saas-profile-info">
              <strong>{profileName}</strong>
              <small>Administrator</small>
            </span>

            <span className="saas-profile-arrow" aria-hidden="true">
              {profileOpen ? "▲" : "▼"}
            </span>
          </button>

          {profileOpen && (
            <div
              className="saas-profile-panel"
              role="menu"
              aria-label="Profile menu"
            >
              <div className="saas-profile-panel-header">
                <img src={profileIcon} alt="" />
                <div>
                  <strong>{profileName}</strong>
                  <span>{profileEmail}</span>
                </div>
              </div>

              <div className="saas-profile-panel-menu">
                <button type="button" onClick={handleProfile} role="menuitem">
                  My Profile
                </button>

                <button
                  type="button"
                  onClick={handleSettings}
                  role="menuitem"
                >
                  Account Settings
                </button>

                <button
                  type="button"
                  className="saas-profile-logout"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;