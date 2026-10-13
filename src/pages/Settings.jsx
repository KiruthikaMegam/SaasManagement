import React, { useEffect, useState } from "react";

import "./Settings.css";

import { useSaaS } from "../context/SaaSContext";

import ConfirmModal from "../components/ConfirmModal";

import settingsIcon from "../assets/settings.png";
import saveIcon from "../assets/save.png";
import resetIcon from "../assets/reset.png";

/* =========================================
   DEFAULT SETTINGS
========================================= */

const defaultSettings = {
  companyName: "SaaS Management",
  companyEmail: "admin@saasmanagement.com",
  timezone: "Asia/Kolkata",
  currency: "USD",
  dateFormat: "YYYY-MM-DD",
  emailNotifications: true,
  subscriptionAlerts: true,
  paymentAlerts: true,
  usageAlerts: false,
  weeklyReports: true
};

/* =========================================
   SETTINGS PAGE
========================================= */

function Settings() {
  const { resetData, showToast } = useSaaS();

  const [settings, setSettings] = useState(defaultSettings);
  const [showResetModal, setShowResetModal] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =========================================
     LOAD SAVED SETTINGS
  ========================================= */

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("saasSettings");

      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        setSettings({
          ...defaultSettings,
          ...parsedSettings
        });
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
      showToast("Unable to load saved settings.", "error");
    }
  }, [showToast]);

  /* =========================================
     HANDLE INPUT CHANGES
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* =========================================
     SAVE SETTINGS
  ========================================= */

  const handleSave = (event) => {
    if (event) {
      event.preventDefault();
    }

    const companyName = settings.companyName.trim();
    const companyEmail = settings.companyEmail.trim();

    if (!companyName) {
      showToast("Please enter the company name.", "error");
      return;
    }

    if (!companyEmail) {
      showToast("Please enter the company email.", "error");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(companyEmail)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    const updatedSettings = {
      ...settings,
      companyName,
      companyEmail
    };

    try {
      setSaving(true);

      localStorage.setItem(
        "saasSettings",
        JSON.stringify(updatedSettings)
      );

      setSettings(updatedSettings);

      showToast("Settings saved successfully.", "success");
    } catch (error) {
      console.error("Unable to save settings:", error);
      showToast("Unable to save settings. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     RESET DASHBOARD DATA
  ========================================= */

  const handleReset = () => {
    try {
      if (typeof resetData !== "function") {
        showToast("Dashboard reset function is unavailable.", "error");
        return;
      }

      resetData();
      setShowResetModal(false);
    } catch (error) {
      console.error("Unable to reset dashboard:", error);
      setShowResetModal(false);
      showToast("Unable to reset dashboard data.", "error");
    }
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">
        <div className="settings-title-wrapper">

          <div className="settings-title-icon">
            <img src={settingsIcon} alt="Settings" />
          </div>

          <div>
            <h1>Settings</h1>

            <p>
              Manage your dashboard preferences
              and notification settings.
            </p>
          </div>

        </div>
      </div>

      {/* COMPANY SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Company Settings</h2>
            <p>Configure your basic company information.</p>
          </div>
        </div>

        <div className="settings-fields">

          <div className="settings-field">
            <label htmlFor="companyName">Company Name</label>

            <input
              id="companyName"
              name="companyName"
              type="text"
              value={settings.companyName}
              onChange={handleChange}
              placeholder="Company name"
              autoComplete="organization"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="companyEmail">Company Email</label>

            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={settings.companyEmail}
              onChange={handleChange}
              placeholder="Company email"
              autoComplete="email"
            />
          </div>

        </div>
      </div>

      {/* REGIONAL SETTINGS */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Regional Settings</h2>
            <p>Configure timezone, currency and date preferences.</p>
          </div>
        </div>

        <div className="settings-fields">

          <div className="settings-field">
            <label htmlFor="timezone">Timezone</label>

            <select
              id="timezone"
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
            >
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="currency">Currency</label>

            <select
              id="currency"
              name="currency"
              value={settings.currency}
              onChange={handleChange}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div className="settings-field">
            <label htmlFor="dateFormat">Date Format</label>

            <select
              id="dateFormat"
              name="dateFormat"
              value={settings.dateFormat}
              onChange={handleChange}
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            </select>
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS */}

      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Notifications</h2>
            <p>Choose which notifications you want to receive.</p>
          </div>
        </div>

        <div className="settings-notifications">

          <label className="settings-toggle-row">
            <div>
              <strong>Email Notifications</strong>
              <span>Receive important account notifications by email.</span>
            </div>

            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
          </label>

          <label className="settings-toggle-row">
            <div>
              <strong>Subscription Alerts</strong>
              <span>Get notified about subscription changes and renewals.</span>
            </div>

            <input
              type="checkbox"
              name="subscriptionAlerts"
              checked={settings.subscriptionAlerts}
              onChange={handleChange}
            />
          </label>

          <label className="settings-toggle-row">
            <div>
              <strong>Payment Alerts</strong>
              <span>Receive payment success and failure notifications.</span>
            </div>

            <input
              type="checkbox"
              name="paymentAlerts"
              checked={settings.paymentAlerts}
              onChange={handleChange}
            />
          </label>

          <label className="settings-toggle-row">
            <div>
              <strong>Usage Alerts</strong>
              <span>Receive alerts when usage limits are close to being reached.</span>
            </div>

            <input
              type="checkbox"
              name="usageAlerts"
              checked={settings.usageAlerts}
              onChange={handleChange}
            />
          </label>

          <label className="settings-toggle-row">
            <div>
              <strong>Weekly Reports</strong>
              <span>Receive a weekly business performance report.</span>
            </div>

            <input
              type="checkbox"
              name="weeklyReports"
              checked={settings.weeklyReports}
              onChange={handleChange}
            />
          </label>

        </div>
      </div>

      {/* ACTION BUTTONS */}

      <div className="settings-actions">

        <button
          type="button"
          className="settings-reset-button"
          onClick={() => setShowResetModal(true)}
        >
          <img src={resetIcon} alt="" />
          <span>Reset Dashboard Data</span>
        </button>

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          <img src={saveIcon} alt="" />
          <span>{saving ? "Saving..." : "Save Settings"}</span>
        </button>

      </div>

      {/* CONFIRMATION MODAL */}

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Dashboard Data?"
        message="This will restore dashboard records to the default sample data. This action cannot be undone."
        confirmText="Reset Data"
        cancelText="Cancel"
        onConfirm={handleReset}
        onClose={() => setShowResetModal(false)}
        type="danger"
      />

    </div>
  );
}

export default Settings;