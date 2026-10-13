import React, { useMemo, useState } from "react";

import "./Revenue.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import SearchFilter from "../components/SearchFilter";
import DateFilter from "../components/DateFilter";
import ChartCard from "../components/ChartCard";
import StatCard from "../components/StatCard";

import revenueIcon from "../assets/revenue.png";
import customersIcon from "../assets/customers.png";
import subscriptionsIcon from "../assets/subscriptions.png";
import refundIcon from "../assets/refund.png";

/* =========================================
   CONVERT MONTH TO YYYY-MM
========================================= */

function getRevenueMonthKey(monthValue, startDate, endDate) {
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

  // Supports January 2026, Jan 2026, January-2026
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
    // Supports labels such as Jan, February, Mar, etc.
    monthName = monthText.toLowerCase();

    // If the record has no year, infer it from the
    // selected dates, or use the current year.
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
   REVENUE PAGE
========================================= */

function Revenue() {
  const {
    revenue = [],
    loading,
    error
  } = useSaaS();

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =========================================
     SEARCH AND DATE FILTER
  ========================================= */

  const filteredRevenue = useMemo(() => {
    const result = [];
    const searchText = search.toLowerCase();

    const startMonth = startDate
      ? startDate.slice(0, 7)
      : "";

    const endMonth = endDate
      ? endDate.slice(0, 7)
      : "";

    for (const item of revenue) {
      const monthText = String(
        item.month || ""
      ).toLowerCase();

      const matchesSearch =
        monthText.includes(searchText);

      const itemMonth = getRevenueMonthKey(
        item.month,
        startDate,
        endDate
      );

      let matchesDate = true;

      if (startMonth || endMonth) {
        if (!itemMonth) {
          matchesDate = false;
        } else {
          if (
            startMonth &&
            itemMonth < startMonth
          ) {
            matchesDate = false;
          }

          if (
            endMonth &&
            itemMonth > endMonth
          ) {
            matchesDate = false;
          }
        }
      }

      if (matchesSearch && matchesDate) {
        result.push(item);
      }
    }

    return result;
  }, [revenue, search, startDate, endDate]);

  /* =========================================
     TOTALS
  ========================================= */

  const totals = useMemo(() => {
    let totalRevenue = 0;
    let totalMRR = 0;
    let totalRefunds = 0;
    let newCustomers = 0;

    for (const item of filteredRevenue) {
      totalRevenue += Number(item.revenue || 0);
      totalMRR += Number(item.mrr || 0);
      totalRefunds += Number(item.refunds || 0);
      newCustomers += Number(item.newCustomers || 0);
    }

    return {
      totalRevenue,
      totalMRR,
      totalRefunds,
      newCustomers
    };
  }, [filteredRevenue]);

  /* =========================================
     MAX REVENUE FOR CHART
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
     MAX MRR FOR CHART
  ========================================= */

  const maxMRR = useMemo(() => {
    let maximum = 0;

    for (const item of filteredRevenue) {
      const value = Number(item.mrr || 0);

      if (value > maximum) {
        maximum = value;
      }
    }

    return maximum || 1;
  }, [filteredRevenue]);

  /* =========================================
     CLEAR FILTERS
  ========================================= */

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  /* =========================================
     LOADING AND ERROR
  ========================================= */

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load revenue"
        message={error}
      />
    );
  }

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="revenue-page">

      {/* HEADER */}

      <div className="revenue-header">
        <div className="revenue-title-wrapper">

          <div className="revenue-title-icon">
            <img
              src={revenueIcon}
              alt="Revenue"
            />
          </div>

          <div>
            <h1>Revenue Analytics</h1>

            <p>
              Track revenue, MRR, refunds and
              customer growth.
            </p>
          </div>

        </div>
      </div>

      {/* FILTERS */}

      <div className="revenue-filter-card">

        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search revenue by month..."
        />

        <DateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClear={handleClearDates}
        />

      </div>

      {/* STAT CARDS */}

      <div className="revenue-stats">

        <StatCard
          title="Total Revenue"
          value={`$${totals.totalRevenue.toLocaleString()}`}
          icon={revenueIcon}
          description="Revenue generated"
        />

        <StatCard
          title="Total MRR"
          value={`$${totals.totalMRR.toLocaleString()}`}
          icon={subscriptionsIcon}
          description="Monthly recurring revenue"
        />

        <StatCard
          title="Total Refunds"
          value={`$${totals.totalRefunds.toLocaleString()}`}
          icon={refundIcon}
          description="Refund amount"
        />

        <StatCard
          title="New Customers"
          value={totals.newCustomers.toLocaleString()}
          icon={customersIcon}
          description="New customers added"
        />

      </div>

      {/* EMPTY STATE */}

      {filteredRevenue.length === 0 ? (
        <EmptyState
          title="No revenue data found"
          message="Try changing your search or date filters."
        />
      ) : (
        <>

          {/* REVENUE TREND CHART */}

          <ChartCard
            title="Revenue Trend"
            subtitle="Monthly revenue performance"
          >
            <div className="revenue-chart">

              <div className="revenue-y-axis">
                <span>
                  ${maxRevenue.toLocaleString()}
                </span>

                <span>
                  ${Math.round(
                    maxRevenue / 2
                  ).toLocaleString()}
                </span>

                <span>$0</span>
              </div>

              <div className="revenue-chart-area">

                <div className="revenue-grid-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="revenue-bars">

                  {filteredRevenue.map(
                    (item, index) => {
                      const value = Number(
                        item.revenue || 0
                      );

                      const height =
                        (value / maxRevenue) * 100;

                      return (
                        <div
                          className="revenue-bar-item"
                          key={
                            item.id ||
                            `${item.month}-${index}`
                          }
                        >

                          <span className="revenue-bar-value">
                            ${value.toLocaleString()}
                          </span>

                          <div className="revenue-bar-track">
                            <div
                              className="revenue-bar"
                              style={{
                                height: `${height}%`
                              }}
                            ></div>
                          </div>

                          <span className="revenue-bar-label">
                            {item.month}
                          </span>

                        </div>
                      );
                    }
                  )}

                </div>
              </div>
            </div>
          </ChartCard>

          {/* MRR PERFORMANCE */}

          <ChartCard
            title="MRR Performance"
            subtitle="Monthly recurring revenue"
          >
            <div className="mrr-list">

              {filteredRevenue.map(
                (item, index) => {
                  const value = Number(
                    item.mrr || 0
                  );

                  const width =
                    (value / maxMRR) * 100;

                  return (
                    <div
                      className="mrr-row"
                      key={
                        item.id ||
                        `${item.month}-mrr-${index}`
                      }
                    >

                      <div className="mrr-row-header">
                        <span>{item.month}</span>

                        <strong>
                          ${value.toLocaleString()}
                        </strong>
                      </div>

                      <div className="mrr-track">
                        <div
                          className="mrr-progress"
                          style={{
                            width: `${width}%`
                          }}
                        ></div>
                      </div>

                    </div>
                  );
                }
              )}

            </div>
          </ChartCard>

          {/* REVENUE DETAILS TABLE */}

          <div className="revenue-table-card">

            <div className="revenue-table-header">
              <div>
                <h2>Revenue Details</h2>

                <p>
                  Detailed monthly revenue performance.
                </p>
              </div>
            </div>

            <div className="revenue-table-wrapper">

              <table className="revenue-table">

                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>MRR</th>
                    <th>Refunds</th>
                    <th>New Customers</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredRevenue.map(
                    (item, index) => (
                      <tr
                        key={
                          item.id ||
                          `${item.month}-${index}`
                        }
                      >

                        <td>
                          <strong>{item.month}</strong>
                        </td>

                        <td>
                          ${Number(
                            item.revenue || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          ${Number(
                            item.mrr || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          ${Number(
                            item.refunds || 0
                          ).toLocaleString()}
                        </td>

                        <td>
                          {Number(
                            item.newCustomers || 0
                          ).toLocaleString()}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>
          </div>

        </>
      )}

    </div>
  );
}

export default Revenue;