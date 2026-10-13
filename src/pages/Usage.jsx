import React, { useMemo, useState } from "react";

import "./Usage.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SearchFilter from "../components/SearchFilter";
import DateFilter from "../components/DateFilter";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";

import usageIcon from "../assets/usage.png";
import usersIcon from "../assets/users.png";
import apiIcon from "../assets/api.png";
import storageIcon from "../assets/storage.png";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];

// Convert a usage month into a comparable YYYY-MM value.
function getUsageMonthKey(monthValue, startDate, endDate) {
  if (!monthValue) {
    return "";
  }

  const text = String(monthValue).trim();

  // Handles YYYY-MM and YYYY-MM-DD.
  const dateMatch = text.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);

  if (dateMatch) {
    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);

    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`;
    }
  }

  // Handles date strings that JavaScript can parse.
  const parsedDate = new Date(text);

  if (
    /\d{4}/.test(text) &&
    !Number.isNaN(parsedDate.getTime())
  ) {
    return `${parsedDate.getFullYear()}-${String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0")}`;
  }

  // Handles labels such as Jan, January, Jan 2026, or January 2026.
  const lowerText = text.toLowerCase();
  let monthIndex = -1;

  for (let index = 0; index < MONTHS.length; index += 1) {
    if (
      lowerText === MONTHS[index] ||
      lowerText === MONTHS[index].slice(0, 3) ||
      lowerText.startsWith(`${MONTHS[index]} `) ||
      lowerText.startsWith(`${MONTHS[index].slice(0, 3)} `)
    ) {
      monthIndex = index;
      break;
    }
  }

  if (monthIndex === -1) {
    return "";
  }

  const yearMatch = text.match(/\b(19|20)\d{2}\b/);

  let year;

  if (yearMatch) {
    year = Number(yearMatch[0]);
  } else if (startDate) {
    year = Number(startDate.slice(0, 4));
  } else if (endDate) {
    year = Number(endDate.slice(0, 4));
  } else {
    year = new Date().getFullYear();
  }

  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function Usage() {
  const {
    usage = [],
    loading,
    error
  } = useSaaS();

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredUsage = useMemo(() => {
    const result = [];
    const searchText = search.toLowerCase().trim();

    const startKey = startDate
      ? startDate.slice(0, 7)
      : "";

    const endKey = endDate
      ? endDate.slice(0, 7)
      : "";

    for (const item of usage) {
      const monthText = String(item.month || "").toLowerCase();

      const matchesSearch =
        searchText === "" || monthText.includes(searchText);

      const monthKey = getUsageMonthKey(
        item.month,
        startDate,
        endDate
      );

      let matchesDate = true;

      if (startKey || endKey) {
        matchesDate = monthKey !== "";

        // Compare monthly periods, not individual days.
        // A month is included when it overlaps the selected range.
        if (matchesDate && startKey && monthKey < startKey) {
          matchesDate = false;
        }

        if (matchesDate && endKey && monthKey > endKey) {
          matchesDate = false;
        }
      }

      if (matchesSearch && matchesDate) {
        result.push(item);
      }
    }

    return result;
  }, [usage, search, startDate, endDate]);

  const totals = useMemo(() => {
    let apiRequests = 0;
    let storage = 0;
    let activeUsers = 0;

    for (const item of filteredUsage) {
      apiRequests += Number(item.apiRequests || 0);
      storage += Number(item.storage || 0);
      activeUsers += Number(item.activeUsers || 0);
    }

    return {
      apiRequests,
      storage,
      activeUsers
    };
  }, [filteredUsage]);

  const maxApiRequests = useMemo(() => {
    let maximum = 0;

    for (const item of filteredUsage) {
      const value = Number(item.apiRequests || 0);

      if (value > maximum) {
        maximum = value;
      }
    }

    return maximum || 1;
  }, [filteredUsage]);

  const maxStorage = useMemo(() => {
    let maximum = 0;

    for (const item of filteredUsage) {
      const value = Number(item.storage || 0);

      if (value > maximum) {
        maximum = value;
      }
    }

    return maximum || 1;
  }, [filteredUsage]);

  const resetFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load usage"
        message={error}
      />
    );
  }

  return (
    <div className="usage-page">
      {/* HEADER */}
      <div className="usage-header">
        <div className="usage-title-wrapper">
          <div className="usage-title-icon">
            <img src={usageIcon} alt="Usage" />
          </div>

          <div>
            <h1>Usage Analytics</h1>
            <p>
              Monitor API requests, storage consumption and active users.
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="usage-filter-card">
        <div className="usage-search-wrapper">
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder="Search usage by month..."
          />
        </div>

        <div className="usage-date-wrapper">
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        <button
          type="button"
          className="usage-reset-button"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>

      {/* STATS */}
      <div className="usage-stats">
        <StatCard
          title="API Requests"
          value={totals.apiRequests.toLocaleString()}
          icon={apiIcon}
          description="Total requests in selected period"
        />

        <StatCard
          title="Storage Usage"
          value={`${totals.storage.toLocaleString()} GB`}
          icon={storageIcon}
          description="Total storage in selected period"
        />

        <StatCard
          title="Active Users"
          value={totals.activeUsers.toLocaleString()}
          icon={usersIcon}
          description="Total active user activity"
        />
      </div>

      {filteredUsage.length === 0 ? (
        <EmptyState
          title="No usage data found"
          message="Try changing your search or date filters."
        />
      ) : (
        <>
          {/* API CHART */}
          <ChartCard
            title="API Request Usage"
            subtitle="Monthly API request consumption"
          >
            <div className="usage-chart">
              <div className="usage-chart-y-axis">
                <span>{maxApiRequests.toLocaleString()}</span>
                <span>
                  {Math.round(maxApiRequests / 2).toLocaleString()}
                </span>
                <span>0</span>
              </div>

              <div className="usage-chart-area">
                <div className="usage-chart-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="usage-bars">
                  {filteredUsage.map((item, index) => {
                    const value = Number(item.apiRequests || 0);
                    const height = (value / maxApiRequests) * 100;

                    return (
                      <div
                        className="usage-bar-item"
                        key={item.id || `${item.month}-${index}`}
                      >
                        <div className="usage-bar-value">
                          {value.toLocaleString()}
                        </div>

                        <div className="usage-bar-track">
                          <div
                            className="usage-bar"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>

                        <span className="usage-bar-label">
                          {item.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ChartCard>

          {/* STORAGE CHART */}
          <ChartCard
            title="Storage Usage"
            subtitle="Monthly storage consumption"
          >
            <div className="usage-storage-chart">
              {filteredUsage.map((item, index) => {
                const value = Number(item.storage || 0);
                const width = (value / maxStorage) * 100;

                return (
                  <div
                    className="storage-row"
                    key={item.id || `${item.month}-storage-${index}`}
                  >
                    <div className="storage-row-header">
                      <span>{item.month}</span>
                      <strong>{value.toLocaleString()} GB</strong>
                    </div>

                    <div className="storage-track">
                      <div
                        className="storage-progress"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>

          {/* TABLE */}
          <div className="usage-table-card">
            <div className="usage-table-header">
              <div>
                <h2>Usage Details</h2>
                <p>Detailed monthly usage statistics.</p>
              </div>

              <span className="usage-result-count">
                {filteredUsage.length} months
              </span>
            </div>

            <div className="usage-table-wrapper">
              <table className="usage-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>API Requests</th>
                    <th>Storage</th>
                    <th>Active Users</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsage.map((item, index) => (
                    <tr
                      key={item.id || `${item.month}-${index}`}
                    >
                      <td>
                        <strong>{item.month}</strong>
                      </td>

                      <td>
                        {Number(item.apiRequests || 0).toLocaleString()}
                      </td>

                      <td>
                        {Number(item.storage || 0).toLocaleString()} GB
                      </td>

                      <td>
                        {Number(item.activeUsers || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Usage;