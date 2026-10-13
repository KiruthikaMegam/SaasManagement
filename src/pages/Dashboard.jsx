import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSaaS } from "../context/SaaSContext";

import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import StatusBadge from "../components/StatusBadge";

import revenueIcon from "../assets/revenue.png";
import usersIcon from "../assets/users.png";
import subscriptionsIcon from "../assets/subscriptions.png";
import plansIcon from "../assets/plans.png";
import arrowRightIcon from "../assets/arrow-right.png";

import "./Dashboard.css";

/* =========================
   REVENUE CHART
========================= */

function RevenueChart({ revenue = [] }) {
  const chartData = revenue.slice(-6);

  if (chartData.length === 0) {
    return (
      <div className="saas-dashboard-chart-empty">
        No revenue data available.
      </div>
    );
  }

  let maximumRevenue = 0;

  for (const item of chartData) {
    const value = Number(item.revenue) || 0;

    if (value > maximumRevenue) {
      maximumRevenue = value;
    }
  }

  if (maximumRevenue === 0) maximumRevenue = 1;

  const chartWidth = 620;
  const chartHeight = 220;
  const chartLeft = 42;
  const chartRight = 12;
  const chartTop = 18;
  const chartBottom = 42;

  const usableWidth = chartWidth - chartLeft - chartRight;
  const usableHeight = chartHeight - chartTop - chartBottom;

  const points = [];

  for (let index = 0; index < chartData.length; index += 1) {
    const item = chartData[index];
    const value = Number(item.revenue) || 0;

    const x =
      chartData.length > 1
        ? chartLeft +
          (index / (chartData.length - 1)) * usableWidth
        : chartLeft;

    const y =
      chartTop +
      usableHeight -
      (value / maximumRevenue) * usableHeight;

    points.push({
      x,
      y,
      label: item.month
    });
  }

  let linePath = "";

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    linePath +=
      index === 0
        ? `M ${point.x} ${point.y}`
        : ` L ${point.x} ${point.y}`;
  }

  let areaPath = "";

  if (points.length > 0) {
    areaPath = `M ${points[0].x} ${
      chartHeight - chartBottom
    }`;

    for (const point of points) {
      areaPath += ` L ${point.x} ${point.y}`;
    }

    const lastPoint = points[points.length - 1];

    areaPath += ` L ${lastPoint.x} ${
      chartHeight - chartBottom
    } Z`;
  }

  return (
    <div className="saas-revenue-chart">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Revenue overview chart"
      >
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#ff4e7c"
              stopOpacity="0.28"
            />
            <stop
              offset="100%"
              stopColor="#ff4e7c"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => {
          const y =
            chartTop + (usableHeight * line) / 3;

          return (
            <line
              key={line}
              x1={chartLeft}
              y1={y}
              x2={chartWidth - chartRight}
              y2={y}
              stroke="#f2e4e8"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill="url(#revenueGradient)" />

        <path
          d={linePath}
          fill="none"
          stroke="#ff4e7c"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#ffffff"
              stroke="#ff4e7c"
              strokeWidth="2"
            />

            <text
              x={point.x}
              y={chartHeight - 16}
              textAnchor="middle"
              fill="#9b8991"
              fontSize="9"
              fontWeight="600"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* =========================
   SUBSCRIPTION CHART
========================= */

function SubscriptionChart({
  subscriptionComparison = []
}) {
  const chartData = subscriptionComparison.slice(-6);

  if (chartData.length === 0) {
    return (
      <div className="saas-dashboard-chart-empty">
        No subscription data available.
      </div>
    );
  }

  let maximumValue = 0;

  for (const item of chartData) {
    const active = Number(item.active) || 0;
    const newSubscriptions =
      Number(item.newSubscriptions) || 0;

    if (active > maximumValue) maximumValue = active;

    if (newSubscriptions > maximumValue) {
      maximumValue = newSubscriptions;
    }
  }

  if (maximumValue === 0) maximumValue = 1;

  return (
    <div className="saas-subscription-chart">
      <div className="saas-subscription-legend">
        <div>
          <span className="saas-legend-dot saas-legend-active" />
          <span>Active</span>
        </div>

        <div>
          <span className="saas-legend-dot saas-legend-new" />
          <span>New</span>
        </div>
      </div>

      <div className="saas-subscription-bars">
        {chartData.map((item, index) => {
          const active = Number(item.active) || 0;
          const newSubscriptions =
            Number(item.newSubscriptions) || 0;

          return (
            <div
              className="saas-subscription-column"
              key={`${item.month}-${index}`}
            >
              <div className="saas-subscription-bar-area">
                <div
                  className="saas-subscription-bar saas-subscription-bar-active"
                  style={{
                    height: `${(active / maximumValue) * 100}%`
                  }}
                  title={`Active: ${active}`}
                />

                <div
                  className="saas-subscription-bar saas-subscription-bar-new"
                  style={{
                    height: `${
                      (newSubscriptions / maximumValue) * 100
                    }%`
                  }}
                  title={`New: ${newSubscriptions}`}
                />
              </div>

              <span>{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   ACTIVITY HISTORY MODAL
========================= */

function ActivityHistoryModal({ activities, onClose }) {
  return (
    <div
      className="saas-activity-modal-overlay"
      onClick={onClose}
    >
      <section
        className="saas-activity-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saas-activity-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="saas-activity-modal-header">
          <div>
            <span className="saas-dashboard-eyebrow">
              ACTIVITY LOG
            </span>

            <h2 id="saas-activity-modal-title">
              Activity History
            </h2>

            <p>
              All available activity across your SaaS platform
            </p>
          </div>

          <button
            type="button"
            className="saas-activity-modal-close"
            onClick={onClose}
            aria-label="Close activity history"
          >
            &times;
          </button>
        </header>

        <div className="saas-activity-modal-summary">
          <span>Recorded activities</span>
          <strong>{activities.length}</strong>
        </div>

        <div className="saas-activity-modal-body">
          {activities.length === 0 ? (
            <div className="saas-dashboard-inline-empty">
              <strong>No activity history available.</strong>
              <span>
                Activities will appear here when they are
                present in your SaaS context.
              </span>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                className="saas-dashboard-activity-item"
                key={
                  activity.id ||
                  `${activity.title || "activity"}-${index}`
                }
              >
                <div className="saas-dashboard-activity-line">
                  <span className="saas-dashboard-activity-dot" />

                  {index < activities.length - 1 && (
                    <span className="saas-dashboard-activity-connector" />
                  )}
                </div>

                <div className="saas-dashboard-activity-content">
                  <strong>
                    {activity.title || "Activity"}
                  </strong>

                  <p>
                    {activity.description || "No description provided."}
                  </p>

                  <small>
                    {activity.time || "Time unavailable"}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="saas-activity-modal-footer">
          <button type="button" onClick={onClose}>
            Close History
          </button>
        </footer>
      </section>
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard() {
  const navigate = useNavigate();

  const [showActivityHistory, setShowActivityHistory] =
    useState(false);

  const {
    dashboardStats = {},
    users = [],
    customers = [],
    plans = [],
    subscriptions = [],
    revenue = [],
    activities = [],
    subscriptionComparison = [],
    loading,
    error,
    showToast
  } = useSaaS();

  const totalRevenue =
    Number(dashboardStats.totalRevenue) || 0;

  const activeUsers =
    Number(dashboardStats.activeUsers) || 0;

  const activeSubscriptions =
    Number(dashboardStats.activeSubscriptions) || 0;

  const monthlyRecurringRevenue =
    Number(dashboardStats.monthlyRecurringRevenue) || 0;

  const totalCustomers =
    Number(dashboardStats.totalCustomers) || customers.length;

  const totalPlans =
    Number(dashboardStats.totalPlans) || plans.length;

  const churnRate =
    Number(dashboardStats.churnRate) || 0;

  const averageRevenuePerUser =
    Number(dashboardStats.averageRevenuePerUser) || 0;

  const recentSubscriptions = subscriptions.slice(0, 5);

  const topPlans = [];

  for (const plan of plans) {
    topPlans.push({
      ...plan,
      subscriberCount: Number(plan.subscribers) || 0
    });
  }

  topPlans.sort(
    (first, second) =>
      second.subscriberCount - first.subscriberCount
  );

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="saas-dashboard-loading">
        <div className="saas-dashboard-loader" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saas-dashboard-error">
        <div className="saas-dashboard-error-icon">!</div>
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="saas-dashboard">
      {/* PAGE HEADER */}

      <section className="saas-dashboard-page-header">
        <div>
          <span className="saas-dashboard-eyebrow">
            OVERVIEW
          </span>

          <h2>Business Overview</h2>

          <p>
            Monitor your SaaS performance, customers and
            revenue from one place.
          </p>
        </div>

        <div className="saas-dashboard-header-actions">
          <button
            type="button"
            className="saas-dashboard-action-button"
            onClick={() => handleNavigation("/Analytics")}
          >
            View Analytics
            <img src={arrowRightIcon} alt="" />
          </button>

          <button
            type="button"
            className="saas-dashboard-primary-button"
            onClick={() => handleNavigation("/Plans")}
          >
            Manage Plans
          </button>
        </div>
      </section>

      {/* STAT CARDS */}

      <section className="saas-dashboard-stats">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={revenueIcon}
          change="+12.8%"
          changeType="positive"
          subtitle="Compared with last month"
          accent="#ff4e7c"
          onClick={() => handleNavigation("/Revenue")}
        />

        <StatCard
          title="Active Users"
          value={activeUsers.toLocaleString()}
          icon={usersIcon}
          change="+8.4%"
          changeType="positive"
          subtitle="Currently active users"
          accent="#8b5cf6"
          onClick={() => handleNavigation("/Users")}
        />

        <StatCard
          title="Subscriptions"
          value={activeSubscriptions.toLocaleString()}
          icon={subscriptionsIcon}
          change="+6.7%"
          changeType="positive"
          subtitle="Active subscriptions"
          accent="#2ea7ff"
          onClick={() => handleNavigation("/Subscriptions")}
        />

        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${monthlyRecurringRevenue.toLocaleString()}`}
          icon={plansIcon}
          change="+10.2%"
          changeType="positive"
          subtitle="Recurring monthly revenue"
          accent="#16b978"
          onClick={() => handleNavigation("/Revenue")}
        />
      </section>

      {/* CHARTS */}

      <section className="saas-dashboard-chart-row">
        <ChartCard
          title="Revenue Overview"
          subtitle="Monthly revenue performance"
          actionText="View Revenue"
          onAction={() => handleNavigation("/Revenue")}
          wide
        >
          <RevenueChart revenue={revenue} />
        </ChartCard>

        <ChartCard
          title="Subscriptions"
          subtitle="Active and new subscriptions"
          actionText="View All"
          onAction={() => handleNavigation("/Subscriptions")}
        >
          <SubscriptionChart
            subscriptionComparison={subscriptionComparison}
          />
        </ChartCard>
      </section>

      {/* RECENT SUBSCRIPTIONS AND PLANS */}

      <section className="saas-dashboard-bottom-row">
        <div className="saas-dashboard-panel saas-dashboard-recent-panel">
          <div className="saas-dashboard-panel-header">
            <div>
              <h3>Recent Subscriptions</h3>
              <p>Latest customer subscriptions</p>
            </div>

            <button
              type="button"
              onClick={() => handleNavigation("/Subscriptions")}
            >
              View All
              <img src={arrowRightIcon} alt="" />
            </button>
          </div>

          <div className="saas-dashboard-subscription-list">
            {recentSubscriptions.length === 0 ? (
              <div className="saas-dashboard-inline-empty">
                No subscriptions available.
              </div>
            ) : (
              recentSubscriptions.map((subscription, index) => (
                <div
                  className="saas-dashboard-subscription-item"
                  key={subscription.id || index}
                >
                  <div className="saas-dashboard-customer-avatar">
                    {String(subscription.customer || "Customer")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="saas-dashboard-customer-info">
                    <strong>
                      {subscription.customer || "Customer"}
                    </strong>

                    <span>
                      {subscription.plan || "Plan"}
                      {" • "}
                      {subscription.billingCycle || "Monthly"}
                    </span>
                  </div>

                  <div className="saas-dashboard-subscription-amount">
                    <strong>
                      ${(
                        Number(subscription.amount) || 0
                      ).toLocaleString()}
                    </strong>

                    <StatusBadge status={subscription.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="saas-dashboard-panel saas-dashboard-plans-panel">
          <div className="saas-dashboard-panel-header">
            <div>
              <h3>Plan Performance</h3>
              <p>Subscribers by pricing plan</p>
            </div>

            <button
              type="button"
              onClick={() => handleNavigation("/Plans")}
            >
              Manage
              <img src={arrowRightIcon} alt="" />
            </button>
          </div>

          <div className="saas-dashboard-plan-list">
            {topPlans.length === 0 ? (
              <div className="saas-dashboard-inline-empty">
                No plans available.
              </div>
            ) : (
              topPlans.slice(0, 4).map((plan, index) => {
                let maximumSubscribers = 1;

                for (const currentPlan of topPlans) {
                  if (
                    currentPlan.subscriberCount >
                    maximumSubscribers
                  ) {
                    maximumSubscribers =
                      currentPlan.subscriberCount;
                  }
                }

                const percentage =
                  (plan.subscriberCount / maximumSubscribers) * 100;

                return (
                  <div
                    className="saas-dashboard-plan-item"
                    key={plan.id || plan.name || index}
                  >
                    <div className="saas-dashboard-plan-top">
                      <div className="saas-dashboard-plan-name">
                        <span
                          className={`saas-dashboard-plan-number saas-dashboard-plan-number-${index}`}
                        >
                          {index + 1}
                        </span>

                        <div>
                          <strong>{plan.name}</strong>
                          <small>
                            ${Number(plan.monthlyPrice) || 0}/month
                          </small>
                        </div>
                      </div>

                      <strong>{plan.subscriberCount}</strong>
                    </div>

                    <div className="saas-dashboard-plan-progress">
                      <span
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* BUSINESS INSIGHTS */}

      <section className="saas-dashboard-insights">
        <div className="saas-dashboard-insight-card">
          <div className="saas-dashboard-insight-icon">$</div>
          <div>
            <span>Average Revenue Per User</span>
            <strong>
              ${averageRevenuePerUser.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="saas-dashboard-insight-card">
          <div className="saas-dashboard-insight-icon">%</div>
          <div>
            <span>Churn Rate</span>
            <strong>{churnRate}%</strong>
          </div>
        </div>

        <div className="saas-dashboard-insight-card">
          <div className="saas-dashboard-insight-icon">C</div>
          <div>
            <span>Total Customers</span>
            <strong>{totalCustomers}</strong>
          </div>
        </div>

        <div className="saas-dashboard-insight-card">
          <div className="saas-dashboard-insight-icon">P</div>
          <div>
            <span>Pricing Plans</span>
            <strong>{totalPlans}</strong>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITIES */}

      <section className="saas-dashboard-panel saas-dashboard-activity-panel">
        <div className="saas-dashboard-panel-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest activity across your SaaS platform</p>
          </div>

          <button
            type="button"
            onClick={() => setShowActivityHistory(true)}
          >
            Activity History
            <img src={arrowRightIcon} alt="" />
          </button>
        </div>

        <div className="saas-dashboard-activity-list">
          {activities.length === 0 ? (
            <div className="saas-dashboard-inline-empty">
              No recent activity available.
            </div>
          ) : (
            activities.slice(0, 5).map((activity, index) => (
              <div
                className="saas-dashboard-activity-item"
                key={
                  activity.id ||
                  `${activity.title || "activity"}-${index}`
                }
              >
                <div className="saas-dashboard-activity-line">
                  <span className="saas-dashboard-activity-dot" />

                  {index < Math.min(activities.length, 5) - 1 && (
                    <span className="saas-dashboard-activity-connector" />
                  )}
                </div>

                <div className="saas-dashboard-activity-content">
                  <strong>{activity.title || "Activity"}</strong>
                  <p>{activity.description || ""}</p>
                  <small>{activity.time || ""}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* QUICK ACTIONS */}

      <section className="saas-dashboard-quick-actions">
        <button
          type="button"
          onClick={() => handleNavigation("/Users")}
        >
          <img src={usersIcon} alt="" />

          <div>
            <strong>Manage Users</strong>
            <span>View and manage platform users</span>
          </div>

          <img
            className="saas-dashboard-quick-arrow"
            src={arrowRightIcon}
            alt=""
          />
        </button>

        <button
          type="button"
          onClick={() => handleNavigation("/Customers")}
        >
          <img src={usersIcon} alt="" />

          <div>
            <strong>Manage Customers</strong>
            <span>View customer accounts and details</span>
          </div>

          <img
            className="saas-dashboard-quick-arrow"
            src={arrowRightIcon}
            alt=""
          />
        </button>

        <button
          type="button"
          onClick={() => handleNavigation("/Plans")}
        >
          <img src={plansIcon} alt="" />

          <div>
            <strong>Manage Plans</strong>
            <span>Create and update pricing plans</span>
          </div>

          <img
            className="saas-dashboard-quick-arrow"
            src={arrowRightIcon}
            alt=""
          />
        </button>
      </section>

      {/* ACTIVITY HISTORY MODAL */}

      {showActivityHistory && (
        <ActivityHistoryModal
          activities={activities}
          onClose={() => setShowActivityHistory(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;