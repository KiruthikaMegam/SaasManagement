import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Subscriptions.css";

import { useSaaS } from "../context/SaaSContext";

import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import ConfirmModal from "../components/ConfirmModal";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import SearchFilter from "../components/SearchFilter";

import subscriptionsIcon from "../assets/subscriptions.png";
import customersIcon from "../assets/customers.png";
import plansIcon from "../assets/plans.png";
import addIcon from "../assets/add.png";
import viewIcon from "../assets/view.png";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

function Subscriptions() {
  const navigate = useNavigate();

  const {
    subscriptions = [],
    loading,
    error,
    deleteSubscription,
    showToast
  } = useSaaS();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [billingFilter, setBillingFilter] = useState("All");

  const [sortField, setSortField] = useState("startDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const itemsPerPage = 8;

  // Status dropdown options
  const statusOptions = useMemo(() => {
    const values = ["All"];

    for (const subscription of subscriptions) {
      if (
        subscription.status &&
        !values.includes(subscription.status)
      ) {
        values.push(subscription.status);
      }
    }

    return values;
  }, [subscriptions]);

  // Plan dropdown options
  const planOptions = useMemo(() => {
    const values = ["All"];

    for (const subscription of subscriptions) {
      if (
        subscription.plan &&
        !values.includes(subscription.plan)
      ) {
        values.push(subscription.plan);
      }
    }

    return values;
  }, [subscriptions]);

  // Billing dropdown options
  const billingOptions = useMemo(() => {
    const values = ["All"];

    for (const subscription of subscriptions) {
      if (
        subscription.billingCycle &&
        !values.includes(subscription.billingCycle)
      ) {
        values.push(subscription.billingCycle);
      }
    }

    return values;
  }, [subscriptions]);

  // Search, filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    const result = [];

    const searchValue = searchTerm.toLowerCase();

    for (const subscription of subscriptions) {
      const matchesSearch =
        !searchValue ||
        String(subscription.customer || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(subscription.plan || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(subscription.id || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        subscription.status === statusFilter;

      const matchesPlan =
        planFilter === "All" ||
        subscription.plan === planFilter;

      const matchesBilling =
        billingFilter === "All" ||
        subscription.billingCycle === billingFilter;

      if (
        matchesSearch &&
        matchesStatus &&
        matchesPlan &&
        matchesBilling
      ) {
        result.push(subscription);
      }
    }

    result.sort((first, second) => {
      let firstValue = first[sortField];
      let secondValue = second[sortField];

      if (sortField === "amount") {
        firstValue = Number(firstValue) || 0;
        secondValue = Number(secondValue) || 0;
      } else {
        firstValue = String(firstValue || "").toLowerCase();
        secondValue = String(secondValue || "").toLowerCase();
      }

      if (firstValue < secondValue) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

    return result;
  }, [
    subscriptions,
    searchTerm,
    statusFilter,
    planFilter,
    billingFilter,
    sortField,
    sortOrder
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredSubscriptions.length / itemsPerPage
  );

  const safeCurrentPage =
    currentPage > totalPages && totalPages > 0
      ? totalPages
      : currentPage;

  const startIndex =
    (safeCurrentPage - 1) * itemsPerPage;

  const paginatedSubscriptions =
    filteredSubscriptions.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // Statistics
  const stats = useMemo(() => {
    let active = 0;
    let trial = 0;
    let pastDue = 0;
    let expired = 0;

    for (const subscription of subscriptions) {
      if (subscription.status === "Active") {
        active += 1;
      }

      if (subscription.status === "Trial") {
        trial += 1;
      }

      if (subscription.status === "Past Due") {
        pastDue += 1;
      }

      if (subscription.status === "Expired") {
        expired += 1;
      }
    }

    return {
      total: subscriptions.length,
      active,
      trial,
      pastDue,
      expired
    };
  }, [subscriptions]);

  // Search and filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePlanChange = (value) => {
    setPlanFilter(value);
    setCurrentPage(1);
  };

  const handleBillingChange = (value) => {
    setBillingFilter(value);
    setCurrentPage(1);
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }

    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return "";
    }

    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteSubscription(deleteTarget.id);

      showToast(
        "Subscription deleted successfully.",
        "success"
      );

      setDeleteTarget(null);

      if (
        paginatedSubscriptions.length === 1 &&
        safeCurrentPage > 1
      ) {
        setCurrentPage(safeCurrentPage - 1);
      }
    } catch (deleteError) {
      showToast(
        "Unable to delete subscription.",
        "error"
      );
    }
  };

  // Table columns
  // DataTable uses the "title" property for column headings.
  const columns = [
    {
      key: "subscription",
      title: "Subscription",
      render: (subscription) => (
        <div className="subscription-main-cell">
          <div className="subscription-icon-box">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <div className="subscription-main-info">
            <strong>{subscription.id}</strong>
            <span>{subscription.customer}</span>
          </div>
        </div>
      )
    },
    {
      key: "plan",
      title: `Plan${getSortIcon("plan")}`,
      onHeaderClick: () => handleSort("plan"),
      render: (subscription) => (
        <span className="subscription-plan">
          {subscription.plan || "-"}
        </span>
      )
    },
    {
      key: "billingCycle",
      title: `Billing${getSortIcon("billingCycle")}`,
      onHeaderClick: () => handleSort("billingCycle"),
      render: (subscription) => (
        <span className="billing-cycle">
          {subscription.billingCycle || "-"}
        </span>
      )
    },
    {
      key: "amount",
      title: `Amount${getSortIcon("amount")}`,
      onHeaderClick: () => handleSort("amount"),
      render: (subscription) => (
        <strong className="subscription-amount">
          ${Number(subscription.amount || 0).toLocaleString()}
        </strong>
      )
    },
    {
      key: "startDate",
      title: `Start Date${getSortIcon("startDate")}`,
      onHeaderClick: () => handleSort("startDate"),
      render: (subscription) => (
        <span>{subscription.startDate || "-"}</span>
      )
    },
    {
      key: "renewalDate",
      title: "Renewal Date",
      render: (subscription) => (
        <span>{subscription.renewalDate || "-"}</span>
      )
    },
    {
      key: "paymentStatus",
      title: "Payment",
      render: (subscription) => (
        <StatusBadge status={subscription.paymentStatus} />
      )
    },
    {
      key: "status",
      title: "Status",
      render: (subscription) => (
        <StatusBadge status={subscription.status} />
      )
    },
    {
      key: "actions",
      title: "Actions",
      render: (subscription) => (
        <div className="subscription-actions">
          <button
            type="button"
            className="table-icon-button"
            onClick={() =>
              navigate(`/Subscriptions/${subscription.id}`)
            }
            title="View subscription"
            aria-label="View subscription"
          >
            <img src={viewIcon} alt="" />
          </button>

          <button
            type="button"
            className="table-icon-button"
            onClick={() =>
              navigate(`/Subscriptions/${subscription.id}/edit`)
            }
            title="Edit subscription"
            aria-label="Edit subscription"
          >
            <img src={editIcon} alt="" />
          </button>

          <button
            type="button"
            className="table-icon-button delete"
            onClick={() => setDeleteTarget(subscription)}
            title="Delete subscription"
            aria-label="Delete subscription"
          >
            <img src={deleteIcon} alt="" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="subscriptions-page">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      {/* Page header */}
      <div className="subscriptions-header">
        <div>
          <span className="page-label">
            SUBSCRIPTION MANAGEMENT
          </span>

          <h1>Subscriptions</h1>

          <p>
            Manage customer subscriptions, billing cycles,
            renewals and payment status.
          </p>
        </div>

        <button
          type="button"
          className="primary-action-button"
          onClick={() => navigate("/Subscriptions/add")}
        >
          <img src={addIcon} alt="" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="subscription-stat-grid">
        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <div>
            <span>Total Subscriptions</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <img src={customersIcon} alt="" />
          </div>

          <div>
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <img src={plansIcon} alt="" />
          </div>

          <div>
            <span>Trial</span>
            <strong>{stats.trial}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <img src={subscriptionsIcon} alt="" />
          </div>

          <div>
            <span>Past Due</span>
            <strong>{stats.pastDue}</strong>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="subscriptions-toolbar">
        <div className="subscriptions-search">
          <SearchFilter
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search subscription, customer or plan..."
          />
        </div>

        <div className="subscription-filter-group">
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) =>
              handleStatusChange(event.target.value)
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Status" : status}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by plan"
            value={planFilter}
            onChange={(event) =>
              handlePlanChange(event.target.value)
            }
          >
            {planOptions.map((plan) => (
              <option key={plan} value={plan}>
                {plan === "All" ? "All Plans" : plan}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by billing cycle"
            value={billingFilter}
            onChange={(event) =>
              handleBillingChange(event.target.value)
            }
          >
            {billingOptions.map((billing) => (
              <option key={billing} value={billing}>
                {billing === "All" ? "All Billing" : billing}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table and empty state */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title="No subscriptions found"
          message="Try changing your search or filters."
        />
      ) : (
        <>
          <div className="subscriptions-table-card">
            <DataTable
              columns={columns}
              data={paginatedSubscriptions}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="subscriptions-pagination">
              <button
                type="button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage(safeCurrentPage - 1)
                }
              >
                Previous
              </button>

              <div className="pagination-pages">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    className={
                      page === safeCurrentPage ? "active" : ""
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage(safeCurrentPage + 1)
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Subscription"
        message={
          deleteTarget
            ? `Are you sure you want to delete subscription ${deleteTarget.id}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Subscriptions;