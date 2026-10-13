import React, { useMemo, useState } from "react";

import "./Analytics.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ChartCard from "../components/ChartCard";
import DateFilter from "../components/DateFilter";
import StatCard from "../components/StatCard";

import revenueIcon from "../assets/revenue.png";
import subscriptionsIcon from "../assets/subscriptions.png";
import usersIcon from "../assets/users.png";
import customersIcon from "../assets/customers.png";

/* =========================================
   CONVERT MONTH TO YYYY-MM
========================================= */

function getAnalyticsMonthKey(monthValue, startDate, endDate) {
  const monthText = String(monthValue || "").trim();

  if (!monthText) {
    return "";
  }

  // Supports YYYY-MM and YYYY-MM-DD
  const isoMatch = monthText.match(
    /^(\d{4})-(\d{2})(?:-\d{2})?$/
  );

  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}`;
  }

  // Supports Jan 2026, January 2026, Jan-2026
  const namedYearMatch = monthText.match(
    /^([A-Za-z]+)[\s,-]+(\d{4})$/
  );

  const monthNames = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12"
  };

  let monthName = "";
  let year = "";

  if (namedYearMatch) {
    monthName = namedYearMatch[1].toLowerCase();
    year = namedYearMatch[2];
  } else {
    // Supports month-only labels such as Jan or February.
    monthName = monthText.toLowerCase();

    if (startDate) {
      year = startDate.slice(0, 4);
    } else if (endDate) {
      year = endDate.slice(0, 4);
    } else {
      year = String(new Date().getFullYear());
    }
  }

  const monthNumber = monthNames[monthName];

  if (!monthNumber || !year) {
    return "";
  }

  return `${year}-${monthNumber}`;
}

/* =========================================
   ANALYTICS PAGE
========================================= */

function Analytics() {
  const {
    revenue = [],
    subscriptionComparison = [],
    planComparison = [],
    dashboardStats = {},
    loading,
    error
  } = useSaaS();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =========================================
     FILTER REVENUE BY DATE
  ========================================= */

  const filteredRevenue = useMemo(() => {
    const result = [];

    const startMonth = startDate
      ? startDate.slice(0, 7)
      : "";

    const endMonth = endDate
      ? endDate.slice(0, 7)
      : "";

    for (const item of revenue) {
      const itemMonth = getAnalyticsMonthKey(
        item.month,
        startDate,
        endDate
      );

      let matchesDate = true;

      if (startMonth || endMonth) {
        if (!itemMonth) {
          matchesDate = false;
        } else {
          if (startMonth && itemMonth < startMonth) {
            matchesDate = false;
          }

          if (endMonth && itemMonth > endMonth) {
            matchesDate = false;
          }
        }
      }

      if (matchesDate) {
        result.push(item);
      }
    }

    return result;
  }, [revenue, startDate, endDate]);

  /* =========================================
     FILTER SUBSCRIPTIONS BY DATE
  ========================================= */

  const filteredSubscriptions = useMemo(() => {
    const result = [];

    const startMonth = startDate
      ? startDate.slice(0, 7)
      : "";

    const endMonth = endDate
      ? endDate.slice(0, 7)
      : "";

    for (const item of subscriptionComparison) {
      const itemMonth = getAnalyticsMonthKey(
        item.month,
        startDate,
        endDate
      );

      let matchesDate = true;

      if (startMonth || endMonth) {
        if (!itemMonth) {
          matchesDate = false;
        } else {
          if (startMonth && itemMonth < startMonth) {
            matchesDate = false;
          }

          if (endMonth && itemMonth > endMonth) {
            matchesDate = false;
          }
        }
      }

      if (matchesDate) {
        result.push(item);
      }
    }

    return result;
  }, [subscriptionComparison, startDate, endDate]);

  /* =========================================
     SUMMARY STATISTICS
  ========================================= */

  const analyticsStats = useMemo(() => {
    let revenueTotal = 0;
    let newCustomers = 0;
    let newSubscriptions = 0;

    for (const item of filteredRevenue) {
      revenueTotal += Number(item.revenue || 0);
      newCustomers += Number(item.newCustomers || 0);
    }

    for (const item of filteredSubscriptions) {
      newSubscriptions += Number(
        item.newSubscriptions || 0
      );
    }

    return {
      revenueTotal,
      newCustomers,
      newSubscriptions
    };
  }, [filteredRevenue, filteredSubscriptions]);

  /* =========================================
     MAX SUBSCRIPTION VALUE
  ========================================= */

  const maxSubscriptionValue = useMemo(() => {
    let maximum = 0;

    for (const item of filteredSubscriptions) {
      const active = Number(item.active || 0);
      const newSubscriptions = Number(
        item.newSubscriptions || 0
      );
      const cancelled = Number(item.cancelled || 0);

      if (active > maximum) {
        maximum = active;
      }

      if (newSubscriptions > maximum) {
        maximum = newSubscriptions;
      }

      if (cancelled > maximum) {
        maximum = cancelled;
      }
    }

    return maximum || 1;
  }, [filteredSubscriptions]);

  /* =========================================
     MAX REVENUE VALUE
  ========================================= */

  const maxRevenue = useMemo(() => {
    let maximum = 0;

    for (const item of filteredRevenue) {
      const value = Number(item.revenue || 0);

      if (value > maximum) {
        maximum = value;
      }
    }

    return maximum || 1;
  }, [filteredRevenue]);

  /* =========================================
     MAX PLAN SUBSCRIBERS
  ========================================= */

  const maxPlanSubscribers = useMemo(() => {
    let maximum = 0;

    for (const item of planComparison) {
      const subscribers = Number(item.subscribers || 0);

      if (subscribers > maximum) {
        maximum = subscribers;
      }
    }

    return maximum || 1;
  }, [planComparison]);

  /* =========================================
     CLEAR DATE FILTER
  ========================================= */

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return <Loader />;
  }

  /* =========================================
     ERROR STATE
  ========================================= */

  if (error) {
    return (
      <ErrorState
        title="Unable to load analytics"
        message={error}
      />
    );
  }

  /* =========================================
     PAGE UI
  ========================================= */

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <div className="analytics-title-wrapper">

          <div className="analytics-title-icon">
            <img src={revenueIcon} alt="Analytics" />
          </div>

          <div>
            <h1>Analytics</h1>

            <p>
              Compare business performance,
              subscriptions and plan growth.
            </p>
          </div>

        </div>
      </div>

      {/* DATE FILTER */}

      <div className="analytics-filter-card">
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClearDates}
        />
      </div>

      {/* SUMMARY CARDS */}

      <div className="analytics-stats">

        <StatCard
          title="Revenue"
          value={`$${analyticsStats.revenueTotal.toLocaleString()}`}
          icon={revenueIcon}
          description="Selected period revenue"
        />

        <StatCard
          title="New Customers"
          value={analyticsStats.newCustomers.toLocaleString()}
          icon={customersIcon}
          description="Customers acquired"
        />

        <StatCard
          title="New Subscriptions"
          value={analyticsStats.newSubscriptions.toLocaleString()}
          icon={subscriptionsIcon}
          description="Subscriptions created"
        />

        <StatCard
          title="Churn Rate"
          value={`${dashboardStats.churnRate || 0}%`}
          icon={usersIcon}
          description="Current churn rate"
        />

      </div>

      {/* REVENUE AND SUBSCRIPTION CHARTS */}

      <div className="analytics-chart-section">

        {/* REVENUE COMPARISON */}

        <ChartCard
          title="Revenue Comparison"
          subtitle="Revenue generated during the selected period"
        >
          {filteredRevenue.length === 0 ? (
            <EmptyState
              title="No revenue data found"
              message="Try selecting a different date range."
            />
          ) : (
            <div className="analytics-revenue-list">

              {filteredRevenue.map((item, index) => {
                const revenueValue = Number(
                  item.revenue || 0
                );

                const width =
                  (revenueValue / maxRevenue) * 100;

                return (
                  <div
                    className="analytics-revenue-row"
                    key={
                      item.id ||
                      `${item.month}-${index}`
                    }
                  >

                    <div className="analytics-revenue-header">
                      <span>{item.month}</span>

                      <strong>
                        ${revenueValue.toLocaleString()}
                      </strong>
                    </div>

                    <div className="analytics-progress-track">
                      <div
                        className="analytics-progress-fill"
                        style={{
                          width: `${width}%`
                        }}
                      ></div>
                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </ChartCard>

        {/* SUBSCRIPTION COMPARISON */}

        <ChartCard
          title="Subscription Comparison"
          subtitle="Active, new and cancelled subscriptions"
        >
          {filteredSubscriptions.length === 0 ? (
            <EmptyState
              title="No subscription data found"
              message="Try selecting a different date range."
            />
          ) : (
            <>
              <div className="analytics-subscription-chart">

                {filteredSubscriptions.map((item, index) => (
                  <div
                    className="analytics-subscription-item"
                    key={
                      item.id ||
                      `${item.month}-${index}`
                    }
                  >

                    <div className="analytics-subscription-bars">

                      {/* ACTIVE */}

                      <div className="analytics-subscription-column">
                        <span>{item.active || 0}</span>

                        <div className="analytics-column-track">
                          <div
                            className="analytics-active-bar"
                            style={{
                              height: `${
                                (Number(item.active || 0) /
                                  maxSubscriptionValue) *
                                100
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* NEW */}

                      <div className="analytics-subscription-column">
                        <span>{item.newSubscriptions || 0}</span>

                        <div className="analytics-column-track">
                          <div
                            className="analytics-new-bar"
                            style={{
                              height: `${
                                (Number(
                                  item.newSubscriptions || 0
                                ) / maxSubscriptionValue) *
                                100
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* CANCELLED */}

                      <div className="analytics-subscription-column">
                        <span>{item.cancelled || 0}</span>

                        <div className="analytics-column-track">
                          <div
                            className="analytics-cancelled-bar"
                            style={{
                              height: `${
                                (Number(item.cancelled || 0) /
                                  maxSubscriptionValue) *
                                100
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                    </div>

                    <span className="analytics-month-label">
                      {item.month}
                    </span>

                  </div>
                ))}

              </div>

              <div className="analytics-legend">

                <span>
                  <i className="legend-active"></i>
                  Active
                </span>

                <span>
                  <i className="legend-new"></i>
                  New
                </span>

                <span>
                  <i className="legend-cancelled"></i>
                  Cancelled
                </span>

              </div>
            </>
          )}
        </ChartCard>

      </div>

      {/* PLAN COMPARISON */}

      <ChartCard
        title="Plan Performance"
        subtitle="Subscriber distribution across plans"
      >
        {planComparison.length === 0 ? (
          <EmptyState
            title="No plan data available"
            message="Plan comparison data will appear here when available."
          />
        ) : (
          <div className="analytics-plan-list">

            {planComparison.map((item, index) => {
              const subscribers = Number(
                item.subscribers || 0
              );

              const percentage = Number(
                item.percentage || 0
              );

              const width =
                (subscribers / maxPlanSubscribers) * 100;

              return (
                <div
                  className="analytics-plan-row"
                  key={
                    item.id ||
                    `${item.plan}-${index}`
                  }
                >

                  <div className="analytics-plan-header">
                    <strong>{item.plan}</strong>

                    <span>
                      {subscribers.toLocaleString()} subscribers
                      {" · "}
                      {percentage}%
                    </span>
                  </div>

                  <div className="analytics-plan-track">
                    <div
                      className="analytics-plan-progress"
                      style={{
                        width: `${width}%`
                      }}
                    ></div>
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </ChartCard>

    </div>
  );
}

export default Analytics;